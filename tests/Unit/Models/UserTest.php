<?php

namespace Tests\Unit\Models;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function obtener_auth_password_retorna_pin()
    {
        $user = User::factory()->create(['pin' => '1234']);
        $this->assertEquals('1234', $user->getAuthPassword());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function castea_active_y_last_login_at()
    {
        $user = User::factory()->create([
            'active' => 1,
            'last_login_at' => now(),
        ]);
        $this->assertIsBool($user->active);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->last_login_at);
    }
}
