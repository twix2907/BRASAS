<?php

namespace Tests\Feature\Pedido;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Table;
use App\Models\User;

class PedidoValidacionTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_pedido_sin_type()
    {
        $mesa = Table::factory()->create();
        $usuario = User::factory()->create();
        $payload = [
            'table_id' => $mesa->id,
            'user_id' => $usuario->id,
            'items' => []
        ];
        $response = $this->postJson('/api/orders', $payload);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['type']);
    }
}
