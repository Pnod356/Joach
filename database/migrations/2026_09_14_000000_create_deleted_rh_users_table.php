<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deleted_rh_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('docrh_id')->nullable();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('matricule');
            $table->json('snapshot');
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('matricule');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deleted_rh_users');
    }
};
