<?php

namespace Tests\Feature\Sistema;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class SistemaStatusTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_permite_cerrar_o_abrir_sistema_sin_token()
    {
        $response = $this->postJson('/api/system/close');
        $response->assertStatus(401);

        $response = $this->postJson('/api/system/open');
        $response->assertStatus(401);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function permite_cerrar_y_abrir_sistema_con_token_valido()
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/system/close');
        $response->assertStatus(200);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/system/open');
        $response->assertStatus(200);
    }
}
