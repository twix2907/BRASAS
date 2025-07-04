<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Devuelve todos los productos activos agrupados por categoría (público)
     */
    public function index(Request $request)
    {
        $productos = Product::where('active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        $agrupados = $productos->groupBy('category')->map(function ($items) {
            return $items->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'description' => $p->description,
                    'price' => $p->price,
                    'image_url' => $p->image_url,
                ];
            });
        });

        return response()->json($agrupados);
    }
}
