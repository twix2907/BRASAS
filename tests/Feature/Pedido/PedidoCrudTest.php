<?php

namespace Tests\Feature\Pedido;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Order;
use App\Models\User;
use App\Models\Table;
use App\Models\Product;

class PedidoCrudTest extends TestCase
{
    use RefreshDatabase;

    private function crearMesaYUsuario()
    {
        $mesa = Table::factory()->create(['name' => 'Mesa 10']);
        $usuario = User::factory()->create(['name' => 'Mesero 1', 'pin' => '1234']);
        return [$mesa, $usuario];
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_pedido_sin_productos()
    {
        [$mesa, $usuario] = $this->crearMesaYUsuario();
        $payload = [
            'table_id' => $mesa->id,
            'user_id' => $usuario->id,
            'type' => 'mesa',
            'items' => []
        ];
        $response = $this->postJson('/api/orders', $payload);
        $response->assertStatus(422);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_crear_pedido_con_productos()
    {
        [$mesa, $usuario] = $this->crearMesaYUsuario();
        $producto = Product::factory()->create(['name' => 'Bife', 'price' => 50]);
        $payload = [
            'table_id' => $mesa->id,
            'user_id' => $usuario->id,
            'type' => 'mesa',
            'items' => [
                [
                    'product_id' => $producto->id,
                    'quantity' => 2,
                    'price' => $producto->price,
                    'nota' => 'Sin sal'
                ]
            ]
        ];
        $response = $this->postJson('/api/orders', $payload);
        $response->assertStatus(201)
            ->assertJsonFragment([
                'table_id' => $mesa->id,
                'user_id' => $usuario->id
            ]);
        $this->assertDatabaseHas('orders', [
            'table_id' => $mesa->id,
            'user_id' => $usuario->id
        ]);
    }
}
