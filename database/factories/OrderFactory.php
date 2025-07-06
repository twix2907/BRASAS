<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'table_id' => Table::factory(),
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['mesa', 'para_llevar', 'delivery']),
            'notes' => $this->faker->optional()->sentence(),
            'status' => $this->faker->randomElement(['activo', 'cerrado', 'cancelado']),
            'total' => $this->faker->randomFloat(2, 10, 500),
            'client_name' => $this->faker->optional()->name(),
            'delivery_location' => $this->faker->optional()->address(),
        ];
    }
}
