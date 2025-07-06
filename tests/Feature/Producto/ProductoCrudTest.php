<?php

namespace Tests\Feature\Producto;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Product;

class ProductoCrudTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_crear_un_producto()
    {
        $payload = [
            'name' => 'Parrilla Mixta',
            'price' => 120.50,
            'category' => 'parrillas',
            'active' => true
        ];

        $response = $this->postJson('/api/productos', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Parrilla Mixta',
                'price' => 120.50,
                'category' => 'parrillas',
                'active' => true
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Parrilla Mixta',
            'price' => 120.50,
            'category' => 'parrillas',
            'active' => true
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_producto_sin_nombre()
    {
        $payload = [
            'price' => 50.00,
            'category' => 'bebidas',
            'active' => true
        ];

        $response = $this->postJson('/api/productos', $payload);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('products', [
            'price' => 50.00,
            'category' => 'bebidas'
        ]);
    }
}
