<?php

namespace Tests\Feature\Usuario;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UsuarioCrudTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_crear_un_usuario()
    {
        $payload = [
            'name' => 'Juan Pérez',
            'username' => 'juanp',
            'pin' => '1234',
            'role' => 'mesero',
            'active' => true
        ];

        $response = $this->postJson('/api/usuarios', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Juan Pérez',
                'username' => 'juanp',
                'role' => 'mesero',
                'active' => true
            ]);

        $this->assertDatabaseHas('users', [
            'username' => 'juanp',
            'name' => 'Juan Pérez',
            'active' => true
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_usuario_con_pin_invalido()
    {
        $payload = [
            'name' => 'Ana',
            'username' => 'ana',
            'pin' => '12', // PIN inválido
            'role' => 'cajero',
            'active' => true
        ];

        $response = $this->postJson('/api/usuarios', $payload);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('users', [
            'username' => 'ana'
        ]);
    }
}
