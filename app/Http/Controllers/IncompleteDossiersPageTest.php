<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Docrh;
use App\Models\Pieces;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IncompleteDossiersPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_incomplete_dossiers_page_lists_only_incomplete_users(): void
    {
        $incompleteUser = Docrh::create([
            'name' => 'Alice Dupont',
            'email' => 'alice@example.com',
            'matricule' => 'RH001',
        ]);

        $completeUser = Docrh::create([
            'name' => 'Bob Martin',
            'email' => 'bob@example.com',
            'matricule' => 'RH002',
        ]);

        $piece = Pieces::create([
            'name' => 'Pièce obligatoire',
            'description' => 'Pièce obligatoire',
            'status' => 'Obligatoire',
        ]);

        $completeUser->pieces()->attach($piece->id, [
            'file_paths' => ['uploads/test.pdf'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->get('/dossierrh/incomplets');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Consultation/Dossierrh/IncompleteDossiers')
            ->where('totalPiecesCount', 1)
            ->where('incompleteUsers.0.name', 'Alice Dupont')
            ->where('incompleteUsers.0.missing_count', 1)
        );
    }
}
