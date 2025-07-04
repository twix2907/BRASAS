<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthorizedDeviceController extends Controller
{
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

    // Solicitud de acceso desde un dispositivo nuevo
    public function requestAccess(Request $request)
    {
        $request->validate([
            'device_id' => 'required|string|unique:authorized_devices,device_id',
            'alias' => 'nullable|string',
        ]);
        $device = \App\Models\AuthorizedDevice::create([
            'device_id' => $request->device_id,
            'alias' => $request->alias,
            'status' => 'pendiente',
            'ip' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'requested_at' => now(),
        ]);
        return response()->json(['message' => 'Solicitud enviada, esperando aprobación del admin.', 'device' => $device], 201);
    }

    // Consultar estado de un dispositivo
    public function status($device_id)
    {
        $device = \App\Models\AuthorizedDevice::where('device_id', $device_id)->first();
        if (!$device) {
            return response()->json(['status' => 'no_registrado'], 404);
        }
        return response()->json(['status' => $device->status, 'device' => $device]);
    }

    // Listar dispositivos pendientes (solo admin)
    public function pending()
    {
        $pending = \App\Models\AuthorizedDevice::where('status', 'pendiente')->get();
        return response()->json($pending);
    }

    // Aprobar dispositivo (solo admin)
    public function approve(Request $request)
    {
        $request->validate(['device_id' => 'required|string|exists:authorized_devices,device_id']);
        $device = \App\Models\AuthorizedDevice::where('device_id', $request->device_id)->first();
        $device->status = 'autorizado';
        $device->approved_at = now();
        $device->approved_by = auth()->id(); // requiere auth admin
        $device->save();
        return response()->json(['message' => 'Dispositivo autorizado', 'device' => $device]);
    }

    // Revocar dispositivo (solo admin)
    public function revoke(Request $request)
    {
        $request->validate(['device_id' => 'required|string|exists:authorized_devices,device_id']);
        $device = \App\Models\AuthorizedDevice::where('device_id', $request->device_id)->first();
        $device->status = 'revocado';
        $device->revoked_at = now();
        $device->revoked_by = auth()->id(); // requiere auth admin
        $device->save();
        return response()->json(['message' => 'Dispositivo revocado', 'device' => $device]);
    }
}
