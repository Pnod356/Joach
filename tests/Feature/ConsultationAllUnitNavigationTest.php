<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Docarchives;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ConsultationAllUnitNavigationTest extends TestCase
{
    use RefreshDatabase;

    public function test_detail_page_receives_previous_search_params_for_return_link(): void
    {
        $user = User::factory()->create([
            'roles' => 'Super',
            'departement' => 'DGB',
        ]);

        $archive = Docarchives::create([
            'typearchive' => 'Convention',
            'description' => 'Contrat de mission',
            'date_doc' => '2024-01-15',
            'format' => 'Document PDF',
            'departement' => 'DGB',
            'filepath' => 'documents/test.pdf',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->post('/touteunite', [
            'description' => 'contrat',
            'typearchive' => 'Convention',
            'departement' => 'DGB',
        ]);

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Consultation/Restreintes/SearchAllUnit')
            ->where('searchParams.description', 'contrat')
            ->where('searchParams.typearchive', 'Convention')
            ->where('searchParams.departement', 'DGB')
        );

        $detailResponse = $this->actingAs($user)->get('/touteunite/' . $archive->id, [
            'description' => 'contrat',
            'typearchive' => 'Convention',
            'departement' => 'DGB',
        ]);

        $detailResponse->assertOk();
        $detailResponse->assertInertia(fn ($page) => $page
            ->component('Consultation/AllUnitView')
            ->where('searchParams.description', 'contrat')
            ->where('searchParams.typearchive', 'Convention')
            ->where('searchParams.departement', 'DGB')
        );
    }
}
