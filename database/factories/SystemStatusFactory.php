<?php

namespace Database\Factories;

use App\Models\SystemStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class SystemStatusFactory extends Factory
{
    protected $model = SystemStatus::class;

    public function definition(): array
    {
        return [
            'status' => $this->faker->randomElement(['abierto', 'cerrado']),
            'opened_at' => $this->faker->optional()->dateTime(),
            'closed_at' => $this->faker->optional()->dateTime(),
        ];
    }
}
