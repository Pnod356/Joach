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
            'id' => 19,
            'name' => 'Actes',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

        Pieces::factory()->create([
            'id' => 20,
            'name' => 'Archives du personnel',
            'description' => '',
            'user_id' => 1,
            'status' => 'Optionnelle',
        ]);

    }

}
