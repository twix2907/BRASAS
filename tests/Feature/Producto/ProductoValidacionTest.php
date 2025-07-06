<?php

namespace Tests\Feature\Producto;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoValidacionTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_producto_sin_precio()
    {
        $payload = [
            'name' => 'Coca Cola',
            'category' => 'bebidas',
            'active' => true
        ];

        $response = $this->postJson('/api/productos', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['price']);
    }
}
