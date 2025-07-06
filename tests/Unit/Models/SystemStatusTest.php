<?php

namespace Tests\Unit\Models;

use App\Models\SystemStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemStatusTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_crear_y_recuperar_estado_sistema()
    {
        $status = SystemStatus::create();
        $this->assertNotNull($status->id);
        $this->assertInstanceOf(SystemStatus::class, $status);
    }
}
