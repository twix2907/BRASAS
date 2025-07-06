<?php

namespace Database\Factories;

use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

class TableFactory extends Factory
{
    protected $model = Table::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'personas' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
