<?php

namespace Tests\Unit\Models;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderItemTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function item_pedido_pertenece_a_producto()
    {
        $product = Product::factory()->create();
        $item = OrderItem::factory()->create(['product_id' => $product->id]);
        $this->assertEquals($product->id, $item->product->id);
    }
}
