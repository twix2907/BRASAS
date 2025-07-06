<?php

namespace Tests\Feature\Usuario;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UsuarioListarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_listar_usuarios()
    {
        User::factory()->count(2)->create();

        $response = $this->getJson('/api/usuarios');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'username', 'role', 'active', 'created_at', 'updated_at']
            ]);
    }
}
