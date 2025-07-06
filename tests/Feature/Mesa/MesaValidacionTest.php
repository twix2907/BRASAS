<?php

namespace Tests\Feature\Mesa;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MesaValidacionTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function no_puede_crear_mesa_sin_personas()
    {
        $payload = [
            'name' => 'Mesa 2',
            'active' => true
        ];

        $response = $this->postJson('/api/mesas', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['personas']);
    }
}
