<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Events\ProductActualizado;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Listar todos los productos (incluye inhabilitados)
    public function index()
    {
        // Forzar headers CORS y JSON para depuración
        return response(Product::all()->toJson(), 200)
            ->header('Content-Type', 'application/json')
            ->header('Access-Control-Allow-Origin', '*');
    }

    /**
     * Store a newly created resource in storage.
     */
    // Crear un nuevo producto
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string|max:255',
            'category' => 'required|string|max:50',
        ]);
        $validated['active'] = true;
        $product = Product::create($validated);
        event(new ProductActualizado($product));
        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    // Mostrar un producto específico
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar producto
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|string|max:255',
            'category' => 'sometimes|required|string|max:50',
            'active' => 'sometimes|boolean',
        ]);
        $product->update($validated);
        event(new ProductActualizado($product));
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    // Inhabilitar producto (no se borra físicamente)
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->active = false;
        $product->save();
        event(new ProductActualizado($product));
        return response()->json(['message' => 'Producto inhabilitado']);
    }
}
