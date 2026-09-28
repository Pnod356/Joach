<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Docrh;
use App\Models\Pieces;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Services\DossierExportService;

class RhController extends Controller
{
    public function create()
    {
        return Inertia::render('Creation/CreateRh', [
            'availablePieces' => Pieces::all()
        ]);
    }

    public function store(Request $request)
    {
        // Validation des données entrantes
        $request->validate([
            'name' => 'required|string|max:255',
            'matricule' => 'required|string|max:255|unique:docrhs,matricule',
            'selectedPieces' => 'array',
            'pieceFiles' => 'array',
        ]);

        try {
            DB::beginTransaction();

            // 1. Création de l'entrée dans docrhs
            $user = Docrh::create([
                'name' => $request->name,
                'matricule' => $request->matricule,
            ]);

            // 2. Traitement des pièces sélectionnées
            if ($request->has('selectedPieces')) {
                foreach ($request->selectedPieces as $pieceId => $value) {

                    // Conversion sécurisée de la valeur en booléen (gère "true", 1, true, etc.)
                    $isPieceSelected = filter_var($value, \FILTER_VALIDATE_BOOLEAN);

                    if ($isPieceSelected) {
                        $filePaths = [];

                        // Vérification et stockage des fichiers pour cet ID précis
                        if ($request->hasFile("pieceFiles.{$pieceId}")) {
                            $files = $request->file("pieceFiles.{$pieceId}");
                            foreach ($files as $file) {
                                // Stockage sur le disque public
                                $path = $file->store('pieces_employes', 'public');
                                $filePaths[] = $path;
                            }
                        }

                        // Remplissage de la table pivot 'piecerhs'
                        // Note : Assurez-vous que la relation dans Docrh.php précise bien 'docrh_id' et 'piece_id'
                        $user->pieces()->attach($pieceId, [
                            'file_paths' => json_encode($filePaths),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('dossierrh.create')->with('message', 'Dossier de l\'employé créé avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            // Retourne l'erreur précise pour le débogage
            return back()->withErrors(['error' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage()]);
        }


    }

    public function edit(Docrh $rhusers)
    {
        // On charge les pièces avec les données pivots
        $rhusers->load('pieces');

        return Inertia::render('Consultation/Dossierrh/EditRh', [
            'user' => $rhusers,
            'availablePieces' => Pieces::all(),
            // On pré-formate les pièces existantes pour le front
            'existingPieces' => $rhusers->pieces->mapWithKeys(function ($piece) {
                return [$piece->id => json_decode($piece->pivot->file_paths, true) ?? []];
            }),
        ]);
    }

    public function updateInfo(Request $request, Docrh $rhusers)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'matricule' => [
                'required',
                'string',
                'max:255',
                Rule::unique('docrhs', 'matricule')->ignore($rhusers->id),
            ],
        ]);

        $rhusers->update($validated);

        return back()->with('message_info', 'Informations personnelles mises à jour.');
    }

    public function updatePieces(Request $request, Docrh $rhusers)
    {
        // Validation : Utilisation de newPieceFiles pour les nouveaux téléchargements
        $request->validate([
            'selectedPieces' => 'array',
            'newPieceFiles.*.*' => 'nullable|file|max:2048',
            'existingPieces' => 'array',
            'filesToDelete' => 'array'
        ]);

        $filesToDelete = $request->input('filesToDelete', []);

        // 1. Charger les pièces actuelles pour différencier l'ajout de la mise à jour
        $rhusers->load('pieces');
        $currentPieceIds = $rhusers->pieces->pluck('id')->toArray();
        $processedPieceIds = [];

        foreach ($request->input('selectedPieces', []) as $pieceId => $isSelected) {
            if (filter_var($isSelected, \FILTER_VALIDATE_BOOLEAN)) {
                $processedPieceIds[] = (int) $pieceId;

                // 1. Récupérer les fichiers restants envoyés par le front
                $paths = $request->input("existingPieces.$pieceId", []);

                // 2. Gérer les nouveaux uploads (newPieceFiles)
                if ($request->hasFile("newPieceFiles.$pieceId")) {
                    foreach ($request->file("newPieceFiles.$pieceId") as $file) {
                        $paths[] = $file->store('pieces_employes', 'public');
                    }
                }

                $pivotData = [
                    'file_paths' => json_encode(array_values($paths)),
                    'updated_at' => now(),
                ];

                // 2. Mise à jour si la relation existe, sinon création
                if (in_array($pieceId, $currentPieceIds)) {
                    // Utilise UPDATE au lieu de DELETE+INSERT : évite les conflits de clé primaire (id)
                    $rhusers->pieces()->updateExistingPivot($pieceId, $pivotData);
                } else {
                    $rhusers->pieces()->attach($pieceId, array_merge($pivotData, ['created_at' => now()]));
                }
            }
        }

        // 3. Détacher les pièces qui ont été décochées (équivalent du comportement sync)
        $toDetach = array_diff($currentPieceIds, $processedPieceIds);
        if (!empty($toDetach)) {
            $rhusers->pieces()->detach($toDetach);
        }

        // 4. Suppression physique des fichiers
        foreach ($filesToDelete as $path) {
            Storage::disk('public')->delete($path);
        }

        return redirect()->route('dossierrh.show', $rhusers->id)->with('message_pieces', 'Le dossier a été mis à jour avec succès.');

    }

    public function destroy(Docrh $rhusers)
    {
        $actor = Auth::user();

        abort_unless(
            $actor && ($actor->roles === 'Super' || ($actor->roles === 'Admin' && $actor->departement === 'SDAG')),
            403,
            'Vous n\'êtes pas autorisé à supprimer un personnel.'
        );

        // SoftDeletes masque le personnel sans supprimer ses liens ni ses fichiers joints.
        // Aucune archive n'est créée : la table deleted_rh_users n'est pas nécessaire.
        $rhusers->delete();

        return redirect()->back()->with('message', 'Le personnel a été supprimé. Les fichiers joints ont été conservés.');
    }

    public function show(Docrh $rhusers)
    {
        // On charge les pièces avec les données pivots
        $rhusers->load('pieces');

        $allPieces = Pieces::all();
        $userPieces = $rhusers->pieces->keyBy('id');

        $validatedPieces = [];
        $missingPieces = [];
        $totalValidated = 0;

        foreach ($allPieces as $piece) {
            $files = [];
            if ($userPieces->has($piece->id)) {
                $pivot = $userPieces->get($piece->id)->pivot;
                $files = json_decode($pivot->file_paths, true) ?? [];
            }

            if (count($files) > 0) {
                $totalValidated++;
                $validatedPieces[] = [
                    'id' => $piece->id,
                    'name' => $piece->name,
                    'files' => $files,
                    'timestamp' => $userPieces->get($piece->id)->pivot->created_at->format('d/m/Y'),
                ];
            } else {
                $missingPieces[] = [
                    'id' => $piece->id,
                    'name' => $piece->name,
                    'description' => $piece->description,
                ];
            }
        }

        $total = $allPieces->count();
        $percentage = $total > 0 ? round(($totalValidated / $total) * 100) : 0;

        $colorClass = $percentage === 100 ? 'bg-green-500' : ($percentage >= 50 ? 'bg-yellow-400' : 'bg-red-500');

        return Inertia::render('Consultation/Dossierrh/ShowRh', [
            'user' => $rhusers,
            'stats' => [
                'total' => $total,
                'validated' => $totalValidated,
                'missing' => $total - $totalValidated,
                'percentage' => $percentage,
                'colorClass' => $colorClass
            ],
            'piecesPossedees' => $validatedPieces,
            'piecesManquantes' => $missingPieces,
        ]);
    }

    public function downloadPiece(Docrh $rhusers, $pieceId, DossierExportService $exportService)
    {
        $piece = Pieces::findOrFail($pieceId);
        return $exportService->downloadPiece($rhusers, $piece);
    }

    public function downloadFullDossier(Docrh $rhusers, DossierExportService $exportService)
    {
        return $exportService->downloadFullDossier($rhusers);
    }

    public function uploadPiece(Request $request, Docrh $rhusers, $pieceId)
    {
        $request->validate([
            'files.*' => 'required|file|mimes:pdf,jpg,png|max:10240', // 10MB max par fichier
        ]);

        $paths = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Stockage : public/uploads/matricule/nom_piece/fichier.pdf
                $paths[] = $file->store("uploads/{$rhusers->matricule}", 'public');
            }
        }

        // Récupération de l'existant ou création
        $userPiece = $rhusers->pieces()->where('piece_id', $pieceId)->first();

        if ($userPiece) {
            $existingFiles = json_decode($userPiece->pivot->file_paths, true) ?? [];
            $newPaths = array_merge($existingFiles, $paths);
            $rhusers->pieces()->updateExistingPivot($pieceId, ['file_paths' => json_encode($newPaths)]);
        } else {
            $rhusers->pieces()->attach($pieceId, ['file_paths' => json_encode($paths)]);
        }

        return back()->with('success', 'Document ajouté avec succès.');

    }

}
