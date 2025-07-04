<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('system_status', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_open')->default(false);
            $table->unsignedBigInteger('opened_by')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->unsignedBigInteger('closed_by')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_status');
    }
};
