<?php

namespace Database\Factories;

use App\Models\AuthorizedDevice;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuthorizedDeviceFactory extends Factory
{
    protected $model = AuthorizedDevice::class;

    public function definition(): array
    {
        return [
            'device_id' => $this->faker->uuid(),
            'alias' => $this->faker->optional()->word(),
            'status' => $this->faker->randomElement(['pendiente', 'autorizado', 'revocado']),
            'ip' => $this->faker->optional()->ipv4(),
            'user_agent' => $this->faker->optional()->userAgent(),
            'requested_at' => $this->faker->optional()->dateTime(),
            'approved_at' => null,
            'revoked_at' => null,
            'approved_by' => null,
            'revoked_by' => null,
        ];
    }
}
