<?php

namespace Tests\Feature\Producto;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Product;

class ProductoEliminarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_inhabilitar_un_producto()
    {
        $producto = Product::factory()->create(['active' => true]);

        $payload = [
            'active' => false
        ];

        $response = $this->putJson('/api/productos/' . $producto->id, $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $producto->id,
                'active' => false
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $producto->id,
            'active' => false
        ]);
    }
}
