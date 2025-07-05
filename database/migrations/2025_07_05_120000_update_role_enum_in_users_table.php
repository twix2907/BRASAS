<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Cambia el enum para permitir el nuevo rol 'cocina'
            $table->enum('role', ['admin', 'cajero', 'mesero', 'cocina'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revierte al enum original sin 'cocina'
            $table->enum('role', ['admin', 'cajero', 'mesero'])->change();
        });
    }
};
