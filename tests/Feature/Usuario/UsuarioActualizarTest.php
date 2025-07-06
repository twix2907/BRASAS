<?php

namespace Tests\Feature\Usuario;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UsuarioActualizarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_actualizar_un_usuario()
    {
        $usuario = User::factory()->create(['name' => 'Juan', 'username' => 'juanp', 'role' => 'mesero']);

        $payload = [
            'name' => 'Juan Pérez',
            'username' => 'juanp',
            'role' => 'admin',
            'active' => true,
            'pin' => '5678'
        ];

        $response = $this->putJson('/api/usuarios/' . $usuario->id, $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Juan Pérez',
                'username' => 'juanp',
                'role' => 'admin',
                'active' => true
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $usuario->id,
            'name' => 'Juan Pérez',
            'username' => 'juanp',
            'role' => 'admin',
            'active' => true
        ]);
    }
}
