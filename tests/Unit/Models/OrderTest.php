<?php

namespace Tests\Unit\Models;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function pedido_tiene_relacion_items()
    {
        $order = Order::factory()->create();
        $item = OrderItem::factory()->create(['order_id' => $order->id]);
        $this->assertTrue($order->items->contains($item));
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function pedido_pertenece_a_mesa()
    {
        $table = Table::factory()->create();
        $order = Order::factory()->create(['table_id' => $table->id]);
        $this->assertEquals($table->id, $order->table->id);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function pedido_pertenece_a_usuario()
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        $this->assertEquals($user->id, $order->user->id);
    }
}
