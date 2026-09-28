<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Docrh;
use App\Models\Pieces;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRequiredPieces = Pieces::where('status', 'Obligatoire')->count();
        $users = Docrh::with('pieces')->get();

        $totalUsers = $users->count();
        $completeDossiersCount = 0;
        $usersNeedingAttention = collect();

        foreach ($users as $user) {
            $requiredPieces = $user->pieces
                ->filter(fn ($piece) => $piece->status === 'Obligatoire');

            $validatedPieces = $requiredPieces->filter(function ($piece) {
                $files = is_string($piece->pivot->file_paths)
                    ? json_decode($piece->pivot->file_paths, true)
                    : $piece->pivot->file_paths;

                return is_array($files) && count($files) > 0;
            })->count();

            $percentage = $totalRequiredPieces > 0 ? round(($validatedPieces / $totalRequiredPieces) * 100) : 0;

            if ($percentage == 100) {
                $completeDossiersCount++;
            }

            if ($percentage < 100) {
                $usersNeedingAttention->push([
                    'id' => $user->id,
                    'name' => $user->name,
                    'matricule' => $user->matricule,
                    'percentage' => $percentage,
                    'missing_count' => max($totalRequiredPieces - $validatedPieces, 0),
                ]);
            }
        }

        return Inertia::render('Consultation/Dossierrh/DossierRh', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'completeDossiersCount' => $completeDossiersCount,
                'incompleteDossiersCount' => $totalUsers - $completeDossiersCount,
                'complianceRate' => $totalUsers > 0 ? round(($completeDossiersCount / $totalUsers) * 100) : 0,
            ],
            'worstDossiers' => $usersNeedingAttention->sortBy('percentage')->take(5)->values(),
            'recentUsers' => Docrh::latest()->take(5)->get()->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'created_at' => $user->created_at->format('d/m/Y'),
            ]),
        ]);

    }

    public function incompleteDossiers(Request $request)
    {
        $requiredPieces = Pieces::where('status', 'Obligatoire')->orderBy('id')->get();
        $totalPieces = $requiredPieces->count();
        $incompleteUsers = $this->getIncompleteDossiers($request, $requiredPieces);
        $perPage = 10;
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $paginatedUsers = new LengthAwarePaginator(
            $incompleteUsers->forPage($currentPage, $perPage)->values(),
            $incompleteUsers->count(),
            $perPage,
            $currentPage,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return Inertia::render('Consultation/Dossierrh/IncompleteDossiers', [
            'incompleteUsers' => $paginatedUsers,
            'totalPiecesCount' => $totalPieces,
            'filters' => $request->only(['search', 'completion']),
        ]);
    }

    /**
     * Exporte tous les dossiers incomplets filtrés dans un fichier Excel compatible.
     */
    public function exportIncompleteDossiers(Request $request)
    {
        $requiredPieces = Pieces::where('status', 'Obligatoire')->orderBy('id')->get();
        $totalPieces = $requiredPieces->count();
        $incompleteUsers = $this->getIncompleteDossiers($request, $requiredPieces);
        $fileName = 'dossiers_incomplets_' . now()->format('Y-m-d_H-i') . '.xls';

        return response()->streamDownload(function () use ($incompleteUsers, $requiredPieces, $totalPieces) {
            echo "\xEF\xBB\xBF";
            echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>';
            echo 'body{font-family:Arial,sans-serif;color:#1f2937}';
            echo 'h1{color:#0f766e}table{border-collapse:collapse;width:100%}';
            echo 'th{background:#0f766e;color:#fff;padding:10px;text-align:left}';
            echo 'td{border:1px solid #d1d5db;padding:8px}';
            echo 'tr:nth-child(even){background:#f0fdfa}.missing{color:#b91c1c;font-weight:bold}';
            echo '</style></head><body>';
            echo '<h1>Dossiers incomplets</h1>';
            echo '<p>Total de pièces obligatoires : ' . $totalPieces . '</p>';
            echo '<table><thead><tr><th>Matricule</th><th>Nom et prénom</th><th>Pièces absentes</th>';
            foreach ($requiredPieces as $piece) {
                echo '<th>' . e(str_replace('_', ' ', $piece->name)) . '</th>';
            }
            echo '<th>Progression</th></tr></thead><tbody>';

            foreach ($incompleteUsers as $user) {
                echo '<tr>';
                echo '<td>' . e($user['matricule']) . '</td>';
                echo '<td>' . e(str_replace('_', ' ', $user['name'])) . '</td>';
                echo '<td class="missing">' . e(implode('; ', $user['missing_pieces'])) . '</td>';
                foreach ($user['piece_statuses'] as $isPresent) {
                    echo '<td class="' . ($isPresent ? '' : 'missing') . '">' . ($isPresent ? 'Oui' : 'Non') . '</td>';
                }
                echo '<td>' . e($user['percentage'] . '%') . '</td>';
                echo '</tr>';
            }

            echo '</tbody></table></body></html>';
        }, $fileName, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
        ]);
    }

    private function getIncompleteDossiers(Request $request, $requiredPieces)
    {
        $searchTerms = preg_split(
            '/\s+/',
            str_replace('_', ' ', trim((string) $request->input('search'))),
            -1,
            \PREG_SPLIT_NO_EMPTY
        );
        $completion = $request->input('completion');
        $totalPieces = $requiredPieces->count();

        return Docrh::with('pieces')->get()->map(function ($user) use ($requiredPieces, $totalPieces) {
            $pieceStatuses = $requiredPieces->mapWithKeys(function ($piece) use ($user) {
                $userPiece = $user->pieces->firstWhere('id', $piece->id);

                return [$piece->id => $this->hasAttachedFiles($userPiece)];
            });
            $validatedPieces = $pieceStatuses->filter()->count();
            $missingPieces = $requiredPieces
                ->filter(fn ($piece) => !$pieceStatuses->get($piece->id))
                ->pluck('name')
                ->map(fn ($name) => str_replace('_', ' ', $name))
                ->values()
                ->all();
            $percentage = $totalPieces > 0 ? round(($validatedPieces / $totalPieces) * 100) : 0;

            return [
                'id' => $user->id,
                'name' => $user->name,
                'matricule' => $user->matricule,
                'percentage' => $percentage,
                'missing_count' => max($totalPieces - $validatedPieces, 0),
                'missing_pieces' => $missingPieces,
                'piece_statuses' => $pieceStatuses->values()->all(),
            ];
        })->filter(function (array $user) use ($searchTerms, $completion) {
            if ($user['percentage'] >= 100) {
                return false;
            }

            $normalizedName = mb_strtolower(str_replace('_', ' ', $user['name'] ?? ''));
            $normalizedMatricule = mb_strtolower((string) ($user['matricule'] ?? ''));

            foreach ($searchTerms as $term) {
                $term = mb_strtolower($term);
                if (!str_contains($normalizedName, $term) && !str_contains($normalizedMatricule, $term)) {
                    return false;
                }
            }

            return match ($completion) {
                'zero' => $user['percentage'] === 0,
                'low' => $user['percentage'] >= 1 && $user['percentage'] < 50,
                'medium' => $user['percentage'] >= 50 && $user['percentage'] < 80,
                'high' => $user['percentage'] >= 80 && $user['percentage'] < 100,
                default => true,
            };
        })->sortBy('percentage')->values();
    }

    public function listview(Request $request)
    {
        $query = Docrh::with('pieces')->latest();

        // 1. Recherche par nom ou matricule (PostgreSQL ilike)
        if ($request->filled('search')) {
            $searchTerms = preg_split('/\s+/', str_replace('_', ' ', trim($request->search)), -1, \PREG_SPLIT_NO_EMPTY);

            // Chaque terme doit être présent dans le nom normalisé ou le matricule.
            // Ainsi « Jean Dupont », « Jean_Dupont » et « Dupont Jean » donnent le même résultat.
            foreach ($searchTerms as $term) {
                $query->where(function (Builder $q) use ($term) {
                    $likeTerm = '%' . $term . '%';

                    $q->whereRaw("REPLACE(name, '_', ' ') ILIKE ?", [$likeTerm])
                      ->orWhere('matricule', 'ilike', $likeTerm);
                });
            }
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
     * Supprime un personnel sans supprimer ses fichiers associés.
     */
    public function destroy($id)
    {
        Docrh::findOrFail($id)->delete();

        return redirect()->route('dossierrh.list')->with('message', 'Le personnel a été supprimé. Les fichiers joints ont été conservés.');
    }

    public function search(Request $request)
    {
        $search = $request->input('search');
        $searchTerms = preg_split('/\s+/', str_replace('_', ' ', trim((string) $search)), -1, \PREG_SPLIT_NO_EMPTY);

        // On récupère les utilisateurs filtrés par nom ou matricule
        $query = Docrh::with('pieces');

        foreach ($searchTerms as $term) {
            $query->where(function (Builder $q) use ($term) {
                $likeTerm = '%' . $term . '%';

                $q->whereRaw("REPLACE(name, '_', ' ') ILIKE ?", [$likeTerm])
                  ->orWhere('matricule', 'ilike', $likeTerm);
            });
        }

        $results = $query->paginate(15)->withQueryString();

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
        $allPieces = Pieces::orderBy('id')->get();
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

            $headers = ['Nom et Prénom', 'Matricule'];
            foreach ($allPieces as $piece) {
                $headers[] = str_replace('_', ' ', $piece->name);
            }
            $headers[] = 'Dernière mise à jour';
            fputcsv($file, $headers);

            foreach ($users as $user) {
                $lastUpdate = null;
                $row = [$user->name, $user->matricule];

                foreach ($allPieces as $piece) {
                    $userPiece = $user->pieces->firstWhere('id', $piece->id);
                    if ($this->hasAttachedFiles($userPiece)) {
                        $row[] = 'Oui';
                        $pieceDate = $userPiece->pivot->updated_at;
                        if (!$lastUpdate || $pieceDate > $lastUpdate) {
                            $lastUpdate = $pieceDate;
                        }
                    } else {
                        $row[] = 'Non';
                    }
                }

                $row[] = $lastUpdate ? $lastUpdate->format('d/m/Y H:i') : 'Aucun document';
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    private function hasAttachedFiles($piece): bool
    {
        if (!$piece || !$piece->pivot) {
            return false;
        }

        $files = is_string($piece->pivot->file_paths)
            ? json_decode($piece->pivot->file_paths, true)
            : $piece->pivot->file_paths;

        return is_array($files) && count($files) > 0;
    }

}
