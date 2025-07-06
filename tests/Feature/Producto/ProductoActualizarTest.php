<?php

namespace Tests\Feature\Producto;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Product;

class ProductoActualizarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_actualizar_un_producto()
    {
        $producto = Product::factory()->create(['name' => 'Parrilla Simple', 'price' => 80]);

        $payload = [
            'name' => 'Parrilla Especial',
            'price' => 120.50,
            'category' => 'parrillas',
            'active' => true
        ];

        $response = $this->putJson('/api/productos/' . $producto->id, $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Parrilla Especial',
                'price' => 120.50,
                'category' => 'parrillas',
                'active' => true
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $producto->id,
            'name' => 'Parrilla Especial',
            'price' => 120.50,
            'category' => 'parrillas',
            'active' => true
        ]);
    }
}
