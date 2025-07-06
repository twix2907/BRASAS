<?php

namespace Tests\Feature\Mesa;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Table;

class MesaListarTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_listar_mesas()
    {
        Table::factory()->count(2)->create();

        $response = $this->getJson('/api/mesas');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'personas', 'active']
            ]);
    }
}
