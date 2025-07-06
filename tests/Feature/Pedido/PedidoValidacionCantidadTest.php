<?php

namespace Tests\Feature\Pedido;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Table;
use App\Models\User;

class PedidoValidacionCantidadTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_pedido_con_items_sin_quantity()
    {
        $mesa = Table::factory()->create();
        $usuario = User::factory()->create();
        $payload = [
            'table_id' => $mesa->id,
            'user_id' => $usuario->id,
            'type' => 'mesa',
            'items' => [
                [
                    'product_id' => 1,
                    // 'quantity' => falta,
                    'price' => 10.0
                ]
            ]
        ];
        $response = $this->postJson('/api/orders', $payload);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['items.0.quantity']);
    }
}
