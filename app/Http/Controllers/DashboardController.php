<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Docrh;
use App\Models\Pieces;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPieces = Pieces::count();
        $users = Docrh::with('pieces')->get();

        $totalUsers = $users->count();
        $completeDossiersCount = 0;
        $usersNeedingAttention = collect();

        foreach ($users as $user) {
            $validatedPieces = 0;

            foreach ($user->pieces as $piece) {
                // Vérification du pivot
                $files = is_string($piece->pivot->file_paths)
                    ? json_decode($piece->pivot->file_paths, true)
                    : $piece->pivot->file_paths;

                if (is_array($files) && count($files) > 0) {
                    $validatedPieces++;
                }
            }

            $percentage = $totalPieces > 0 ? round(($validatedPieces / $totalPieces) * 100) : 0;

            if ($percentage == 100) {
                $completeDossiersCount++;
            }

            if ($percentage < 100) {
                $usersNeedingAttention->push([
                    'id' => $user->id,
                    'name' => $user->name,
                    'matricule' => $user->matricule,
                    'percentage' => $percentage,
                    'missing_count' => $totalPieces - $validatedPieces
                ]);
            }
        }

        return Inertia::render('Consultation/Dossierrh/DossierRh', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'completeDossiersCount' => $completeDossiersCount,
                'incompleteDossiersCount' => $totalUsers - $completeDossiersCount,
                'complianceRate' => $totalUsers > 0 ? round((($totalUsers - $completeDossiersCount) / $totalUsers) * 100) : 0,
            ],
            'worstDossiers' => $usersNeedingAttention->sortBy('percentage')->take(5)->values(),
            'recentUsers' => Docrh::latest()->take(5)->get()->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'created_at' => $user->created_at->format('d/m/Y'),
            ]),
        ]);

    }

    public function incompleteDossiers()
    {
        $totalPieces = Pieces::where('status', 'Obligatoire')->count();
        $incompleteUsers = collect();

        foreach (Docrh::with('pieces')->get() as $user) {
            $validatedPieces = 0;

            foreach ($user->pieces as $piece) {
                $files = is_string($piece->pivot->file_paths)
                    ? json_decode($piece->pivot->file_paths, true)
                    : $piece->pivot->file_paths;

                if (is_array($files) && count($files) > 0) {
                    $validatedPieces++;
                }
            }

            $percentage = $totalPieces > 0 ? round(($validatedPieces / $totalPieces) * 100) : 0;

            if ($percentage < 100) {
                $incompleteUsers->push([
                    'id' => $user->id,
                    'name' => $user->name,
                    'matricule' => $user->matricule,
                    'percentage' => $percentage,
                    'missing_count' => $totalPieces - $validatedPieces,
                ]);
            }
        }

        return Inertia::render('Consultation/Dossierrh/IncompleteDossiers', [
            'incompleteUsers' => $incompleteUsers->sortBy('percentage')->values(),
            'totalPiecesCount' => $totalPieces,
        ]);
    }

    public function listview(Request $request)
    {
        $query = Docrh::with('pieces')->latest();

        // 1. Recherche par nom ou matricule (PostgreSQL ilike)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'ilike', '%' . $search . '%')
                  ->orWhere('matricule', 'ilike', '%' . $search . '%');
            });
        }

        // 2. Filtre par pièce spécifique et statut
        if ($request->filled(['pieceFilterId', 'pieceFilterStatus'])) {
            $pieceId = $request->pieceFilterId;
            $status = $request->pieceFilterStatus;

            $pieceCondition = function (Builder $q) use ($pieceId) {
                $q->where('pieces.id', $pieceId)
                  ->whereNotNull('piecerhs.file_paths');
                // Note : Pour JSON sur PostgreSQL, on vérifie que ce n'est pas un tableau vide '[]'
                $q->whereRaw("jsonb_array_length(piecerhs.file_paths::jsonb) > 0");
            };

            if ($status === 'has') {
                $query->whereHas('pieces', $pieceCondition);
            } elseif ($status === 'missing') {
                $query->whereDoesntHave('pieces', $pieceCondition);
            }
        }

        $results = $query->paginate(10)->withQueryString();

        return Inertia::render('Consultation/Dossierrh/ListRh', [
            'users' => $results,
            'availablePieces' => Pieces::all(),
            'totalPiecesCount' => Pieces::where('status', 'Obligatoire')->count(),
            'filters' => $request->only(['search', 'pieceFilterId', 'pieceFilterStatus'])
        ]);

    }

    /**
     * Supprime un dossier et ses fichiers associés
     */
    public function destroy($id)
    {
        $user = Docrh::with('pieces')->findOrFail($id);

        // Suppression des fichiers physiques sur le disque
        foreach ($user->pieces as $piece) {
            $paths = is_string($piece->pivot->file_paths)
                ? json_decode($piece->pivot->file_paths, true)
                : $piece->pivot->file_paths;

            if (is_array($paths)) {
                foreach ($paths as $path) {
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }
        }

        // Suppression de l'entrée en base de données
        $user->delete();

        return redirect()->route('dossierrh.list')->with('message', 'Le dossier et ses documents ont été supprimés définitivement.');
    }

    public function search(Request $request)
    {
        $search = $request->input('search');

        // On récupère les utilisateurs filtrés par nom ou matricule
        $results = Docrh::with('pieces')
            ->where(function (Builder $q) use ($search) {
                $q->where('name', 'ilike', '%' . $search . '%')
                ->orWhere('matricule', 'ilike', '%' . $search . '%');
            })
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Consultation/Dossierrh/SearchRh', [
            'users' => $results,
            'totalPiecesCount' => Pieces::count(),
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function downloadGeneralReport(Request $request)
    {
        $allPieces = Pieces::all();
        // Fetch all users with their associated pieces
        $users = Docrh::with('pieces')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="rapport_general_dossiers_rh_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($users, $allPieces) {
            $file = fopen('php://output', 'w');

            // Add BOM for UTF-8 compatibility in Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // CSV Header
            fputcsv($file, ['Nom et Prénom', 'Matricule', 'Pièces Présentes', 'Pièces Manquantes', 'Dernière mise à jour']);

            foreach ($users as $user) {
                $presentPieces = [];
                $missingPieces = [];
                $lastUpdate = null;

                foreach ($allPieces as $piece) {
                    $userPiece = $user->pieces->firstWhere('id', $piece->id);
                    $isValidated = false;

                    if ($userPiece) {
                        $files = is_string($userPiece->pivot->file_paths)
                            ? json_decode($userPiece->pivot->file_paths, true)
                            : $userPiece->pivot->file_paths;

                        if (is_array($files) && count($files) > 0) {
                            $isValidated = true;

                            // Comparaison pour trouver la date la plus récente
                            $pieceDate = $userPiece->pivot->updated_at;
                            if (!$lastUpdate || $pieceDate > $lastUpdate) {
                                $lastUpdate = $pieceDate;
                            }
                        }
                    }

                    if ($isValidated) {
                        $presentPieces[] = $piece->name;
                    } else {
                        $missingPieces[] = $piece->name;
                    }
                }

                fputcsv($file, [
                    $user->name,
                    $user->matricule,
                    implode('; ', $presentPieces),
                    implode('; ', $missingPieces),
                    $lastUpdate ? $lastUpdate->format('d/m/Y H:i') : 'Aucun document'
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

}
