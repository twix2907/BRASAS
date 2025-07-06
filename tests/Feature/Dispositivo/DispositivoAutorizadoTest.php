<?php

namespace Tests\Feature\Dispositivo;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class DispositivoAutorizadoTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_permite_acceso_a_endpoints_de_dispositivos_sin_autenticacion()
    {
        $response = $this->getJson('/api/devices/pending');
        $response->assertStatus(401);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function permite_acceso_a_endpoints_de_dispositivos_con_token_valido()
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/devices/pending');

        $response->assertStatus(200);
    }
}
