<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pieces;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Pieces::factory()->create([
            'id' => 1,
            'name' => 'Fiche de renseignement',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);

        Pieces::factory()->create([
            'id' => 2,
            'name' => 'Acte d\'intégration ou contrat',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);

        Pieces::factory()->create([
            'id' => 3,
            'name' => 'Avenant contrat de contrat',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 4,
            'name' => 'Certificat de prise de service',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);

        Pieces::factory()->create([
            'id' => 5,
            'name' => 'Décrets, arrêtés ou décision de nomination',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 6,
            'name' => 'Note d\'affectation à la DGB',
            'description' => '',
            'user_id'=> 1,
            'status' => 'Obligatoire',
        ]);

        Pieces::factory()->create([
            'id' => 7,
            'name' => 'Acte d\'avancement',
            'description' => '',
            'user_id'=> 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 8,
            'name' => 'Attestation de présence effective',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);

        // Pieces::factory()->create([
        //     'id' => 9,
        //     'name' => 'Certificat de prise de service',
        //     'description' => '',
        //     'user_id' => 1,
        // ]);

        Pieces::factory()->create([
            'id' => 9,
            'name' => 'Acte de reclassement',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 10,
            'name' => 'Acte de mariage',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 11,
            'name' => 'Diplôme le plus élevé',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 12,
            'name' => 'Diplôme d\'intégration',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);


        Pieces::factory()->create([
            'id' => 13,
            'name' => 'CNI',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);

        Pieces::factory()->create([
            'id' => 14,
            'name' => 'Récépissé COPPE',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 15,
            'name' => 'Actes de naissance des enfants mineurs',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 16,
            'name' => 'Permis de conduire',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 17,
            'name' => 'Certificat ou attestation de formation',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 18,
            'name' => 'Acte de naissance',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);

        Pieces::factory()->create([
            'id' => 19,
            'name' => 'Actes',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);

        Pieces::factory()->create([
            'id' => 20,
            'name' => 'Archives Personnel',
            'description' => '',
            'user_id' => 1,
            'status' => 'Obligatoire',
        ]);
    }

}
