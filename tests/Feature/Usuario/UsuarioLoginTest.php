<?php

namespace Tests\Feature\Usuario;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UsuarioLoginTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function login_exitoso_con_pin_correcto()
    {
        $usuario = User::factory()->create(['username' => 'juanp', 'pin' => '1234', 'active' => true]);

        $payload = [
            'username' => 'juanp',
            'pin' => '1234'
        ];

        $response = $this->postJson('/api/login', $payload);
        $response->assertStatus(200)
            ->assertJsonFragment([
                'username' => 'juanp'
            ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function login_falla_con_pin_incorrecto()
    {
        $usuario = User::factory()->create(['username' => 'juanp', 'pin' => '1234', 'active' => true]);

        $payload = [
            'username' => 'juanp',
            'pin' => '9999'
        ];

        $response = $this->postJson('/api/login', $payload);
        $response->assertStatus(401);
    }
}
