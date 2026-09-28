<?php

namespace Database\Seeders;

use App\Models\User;
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

        User::factory()->create([
            'id' => 1,
            'name' => 'Administrateur',
            'matricule' => 'XXX XXX X',
            'username' => 'admin@archidoc.com',
            'email' => 'admin',
            'phone' => '6xx xx xx xx',
            'roles' => 'Super',
            'statut' => 'Actif',
            'departement' => 'DGB',
            'password' => 'OOOOO',
        ]);

        User::factory()->create([
            'id' => 2,
            'name' => 'Test User',
            'matricule' => 'XXX XXX X',
            'username' => 'user@archidoc.com',
            'email' => 'test.user',
            'phone' => '6xx xx xx xx',
            'roles' => 'User',
            'statut' => 'Actif',
            'departement' => 'S-DAG',
            'password' => 'OOOOO',
        ]);

         User::factory()->create([
            'id' => 3,
            'name' => 'Test User 2',
            'matricule' => 'XXX XXX Y',
            'username' => 'user2@archidoc.com',
            'email' => 'test.user2',
            'phone' => '6xx xx xx xy',
            'roles' => 'User',
            'statut' => 'Actif',
            'departement' => 'DPC',
            'password' => 'OOOOO',
        ]);
    }

}
