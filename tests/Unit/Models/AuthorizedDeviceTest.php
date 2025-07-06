<?php

namespace Tests\Unit\Models;

use App\Models\AuthorizedDevice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizedDeviceTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_crear_y_recuperar_dispositivo_autorizado()
    {
        $device = AuthorizedDevice::factory()->create();
        $this->assertNotNull($device->id);
        $this->assertInstanceOf(AuthorizedDevice::class, $device);
    }
}
