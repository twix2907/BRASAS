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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre del producto
            $table->string('description')->nullable(); // Descripción corta
            $table->decimal('price', 8, 2); // Precio
            $table->string('image_url')->nullable(); // URL de la imagen
            $table->string('category'); // Categoría (entradas, parrillas, etc.)
            $table->boolean('active')->default(true); // Para inhabilitar producto
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
