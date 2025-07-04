<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('authorized_devices', function (Blueprint $table) {
            $table->id();
            $table->string('device_id')->unique();
            $table->string('alias')->nullable();
            $table->enum('status', ['pendiente', 'autorizado', 'revocado'])->default('pendiente');
            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->unsignedBigInteger('revoked_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('authorized_devices');
    }
};
