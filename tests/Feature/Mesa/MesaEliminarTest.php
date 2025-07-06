<?php

namespace Tests\Feature\Mesa;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Table;

class MesaEliminarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_inhabilitar_una_mesa()
    {
        $mesa = Table::factory()->create(['active' => true]);

        $payload = [
            'active' => false
        ];

        $response = $this->putJson('/api/mesas/' . $mesa->id, $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $mesa->id,
                'active' => false
            ]);

        $this->assertDatabaseHas('tables', [
            'id' => $mesa->id,
            'active' => false
        ]);
    }
}
