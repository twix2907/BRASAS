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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('table_id')->nullable()->constrained('tables'); // Mesa (nullable para delivery/para llevar)
            $table->foreignId('user_id')->constrained('users'); // Usuario que crea el pedido
            $table->enum('type', ['mesa', 'para_llevar', 'delivery']); // Tipo de pedido
            $table->enum('status', ['activo', 'por_cobrar', 'cerrado', 'cancelado'])->default('activo'); // Estado del pedido
            $table->decimal('total', 8, 2)->default(0); // Total del pedido
            $table->string('notes')->nullable(); // Notas generales
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
