<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SystemStatusController extends Controller
{
    /**
     * Cierra el sistema (cambia el estado global a cerrado)
     */
    public function close()
    {
        // Aquí iría la lógica real de cierre del sistema
        return response()->json(['message' => 'Sistema cerrado'], 200);
    }

    /**
     * Abre el sistema (cambia el estado global a abierto)
     */
    public function open()
    {
        // Aquí iría la lógica real de apertura del sistema
        return response()->json(['message' => 'Sistema abierto'], 200);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
