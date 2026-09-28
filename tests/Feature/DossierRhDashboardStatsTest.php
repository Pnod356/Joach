<?php

namespace Tests\Feature;

use App\Models\Docrh;
use App\Models\Pieces;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DossierRhDashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_use_only_required_pieces_and_complete_ratio(): void
    {
        $ownerUser = User::create([
            'name' => 'Owner',
            'matricule' => 'OWNER',
            'username' => 'owner',
            'email' => 'owner@example.com',
            'phone' => null,
            'roles' => 'admin',
            'statut' => 'actif',
            'departement' => 'RH',
            'password' => bcrypt('password'),
        ]);

        $completeUser = Docrh::create([
            'name' => 'Bob Martin',
            'email' => 'bob@example.com',
            'matricule' => 'RH002',
        ]);

        $incompleteUser = Docrh::create([
            'name' => 'Alice Dupont',
            'email' => 'alice@example.com',
            'matricule' => 'RH001',
        ]);

        $requiredPieceA = Pieces::create([
            'name' => 'Pièce A obligatoire',
            'description' => 'Pièce obligatoire A',
            'status' => 'Obligatoire',
            'user_id' => $ownerUser->id,
        ]);

        $requiredPieceB = Pieces::create([
            'name' => 'Pièce B obligatoire',
            'description' => 'Pièce obligatoire B',
            'status' => 'Obligatoire',
            'user_id' => $ownerUser->id,
        ]);

        $optionalPiece = Pieces::create([
            'name' => 'Pièce facultative',
            'description' => 'Pièce facultative',
            'status' => 'Facultatif',
            'user_id' => $ownerUser->id,
        ]);

        $completeUser->pieces()->attach([
            $requiredPieceA->id => ['file_paths' => json_encode(['uploads/a.pdf']), 'created_at' => now(), 'updated_at' => now()],
            $requiredPieceB->id => ['file_paths' => json_encode(['uploads/b.pdf']), 'created_at' => now(), 'updated_at' => now()],
            $optionalPiece->id => ['file_paths' => json_encode(['uploads/optional.pdf']), 'created_at' => now(), 'updated_at' => now()],
        ]);

        $incompleteUser->pieces()->attach([
            $requiredPieceA->id => ['file_paths' => json_encode(['uploads/a.pdf']), 'created_at' => now(), 'updated_at' => now()],
            $requiredPieceB->id => ['file_paths' => json_encode([]), 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->actingAs($ownerUser);

        $response = $this->get('/dossierrh');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Consultation/Dossierrh/DossierRh')
            ->where('stats.totalUsers', 2)
            ->where('stats.completeDossiersCount', 1)
            ->where('stats.incompleteDossiersCount', 1)
            ->where('stats.complianceRate', 50)
        );
    }
}
