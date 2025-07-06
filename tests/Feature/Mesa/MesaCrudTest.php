<?php

namespace Tests\Feature\Mesa;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Table;

class MesaCrudTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_crear_una_mesa()
    {
        $payload = [
            'name' => 'Mesa 1',
            'personas' => 4,
            'estado' => 'libre',
            'active' => true
        ];

        $response = $this->postJson('/api/mesas', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Mesa 1',
                'personas' => 4,
                'active' => true
            ]);

        $this->assertDatabaseHas('tables', [
            'name' => 'Mesa 1',
            'personas' => 4,
            'active' => true
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_mesa_sin_nombre()
    {
        $payload = [
            'personas' => 2,
            'estado' => 'libre',
            'active' => true
        ];

        $response = $this->postJson('/api/mesas', $payload);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('tables', [
            'personas' => 2
        ]);
    }
}
