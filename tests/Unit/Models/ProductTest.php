<?php

namespace Tests\Unit\Models;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function producto_campos_fillable_asignables()
    {
        $data = [
            'name' => 'Test',
            'description' => 'Desc',
            'price' => 10.5,
            'image_url' => 'url',
            'category' => 'cat',
            'active' => true,
        ];
        $product = Product::create($data);
        foreach ($data as $key => $value) {
            $this->assertEquals($value, $product->{$key});
        }
    }
}
