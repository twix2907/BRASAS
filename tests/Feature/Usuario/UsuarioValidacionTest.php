<?php

namespace Tests\Feature\Usuario;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UsuarioValidacionTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_usuario_sin_username()
    {
        $payload = [
            'name' => 'Pedro',
            'pin' => '1234',
            'role' => 'mesero',
            'active' => true
        ];

        $response = $this->postJson('/api/usuarios', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['username']);
    }
}
