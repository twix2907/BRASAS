<?php

namespace Tests\Feature\Usuario;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UsuarioEliminarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_inhabilitar_un_usuario()
    {
        $usuario = User::factory()->create(['active' => true]);

        $payload = [
            'active' => false
        ];

        $response = $this->putJson('/api/usuarios/' . $usuario->id, $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $usuario->id,
                'active' => false
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $usuario->id,
            'active' => false
        ]);
    }
}
