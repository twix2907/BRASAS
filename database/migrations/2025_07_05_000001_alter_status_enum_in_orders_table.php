<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Agrega 'por_cobrar' al enum status
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('activo','por_cobrar','cerrado','cancelado') NOT NULL DEFAULT 'activo'");
    }

    public function down(): void
    {
        // Quita 'por_cobrar' del enum status
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('activo','cerrado','cancelado') NOT NULL DEFAULT 'activo'");
    }
};
