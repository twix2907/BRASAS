<?php

namespace Tests\Feature\Mesa;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Table;

class MesaActualizarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_actualizar_una_mesa()
    {
        $mesa = Table::factory()->create(['name' => 'Mesa 1', 'personas' => 4]);

        $payload = [
            'name' => 'Mesa VIP',
            'personas' => 8,
            'active' => true
        ];

        $response = $this->putJson('/api/mesas/' . $mesa->id, $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Mesa VIP',
                'personas' => 8,
                'active' => true
            ]);

        $this->assertDatabaseHas('tables', [
            'id' => $mesa->id,
            'name' => 'Mesa VIP',
            'personas' => 8,
            'active' => true
        ]);
    }
}
