<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Table;
use App\Events\MesaActualizada;

class TableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Listar todas las mesas (incluye inhabilitadas)
    public function index()
    {
        // Devolver mesas con estado derivado
        $mesas = Table::all()->map(function($mesa) {
            return [
                'id' => $mesa->id,
                'name' => $mesa->name,
                'personas' => $mesa->personas,
                'active' => $mesa->active,
                'status' => $mesa->status, // Calculado dinámicamente
            ];
        });
        return response()->json($mesas);
    }

    /**
     * Store a newly created resource in storage.
     */
    // Crear una nueva mesa
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:tables,name',
            'personas' => 'nullable|integer|min:0|max:30',
        ]);
        $validated['active'] = true;
        $validated['status'] = 'libre';
        $table = Table::create($validated);
        \Illuminate\Support\Facades\Log::info('Llamando a event MesaActualizada', ['mesa_id' => $table->id, 'mesa_name' => $table->name]);
        event(new MesaActualizada($table));
        return response()->json($table, 201);
    }

    /**
     * Display the specified resource.
     */
    // Mostrar una mesa específica
    public function show($id)
    {
        $table = Table::findOrFail($id);
        return response()->json($table);
    }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar mesa
    public function update(Request $request, $id)
    {
        $table = Table::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:50|unique:tables,name,' . $table->id,
            'personas' => 'nullable|integer|min:0|max:30',
            'status' => 'sometimes|required|in:libre,ocupada',
            'active' => 'sometimes|boolean',
        ]);
        $table->update($validated);
        event(new MesaActualizada($table));
        return response()->json($table);
    }

    /**
     * Remove the specified resource from storage.
     */
    // Inhabilitar mesa (no se borra físicamente)
    public function destroy($id)
    {
        $table = Table::findOrFail($id);
        $table->active = false;
        $table->save();
        event(new MesaActualizada($table));
        return response()->json(['message' => 'Mesa inhabilitada']);
    }
}
