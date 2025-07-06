<?php

namespace Tests\Feature\Producto;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Product;

class ProductoListarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_listar_productos()
    {
        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/productos');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'price', 'category', 'active', 'created_at', 'updated_at']
            ]);
    }
}
