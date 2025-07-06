<?php

namespace Tests\Unit\Models;

use App\Models\Table;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TableTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function estado_es_ocupada_si_tiene_pedido_activo()
    {
        $table = Table::factory()->create();
        Order::factory()->create([
            'table_id' => $table->id,
            'status' => 'activo',
        ]);

        $this->assertEquals('ocupada', $table->fresh()->status);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function estado_es_libre_si_no_tiene_pedido_activo()
    {
        $table = Table::factory()->create();
        $this->assertEquals('libre', $table->status);
    }
}
