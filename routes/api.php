<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CloudinaryImageController;
use App\Http\Controllers\Api\MenuController;

// Health check para Railway
Route::get('/health', function () {
    return response()->json(['status' => 'healthy'], 200);
});

// Health check alternativo
Route::get('/up', function () {
    return response('OK', 200);
});

// Endpoint público para la carta/menu
Route::get('/menu', [MenuController::class, 'index']);

// Endpoint para datos de impresión de ticket/comanda
Route::get('/orders/{id}/print-data', [OrderController::class, 'printData']);

// Rutas CRUD de productos (apiResource)
Route::apiResource('productos', ProductController::class);
// Rutas CRUD de mesas (apiResource)
Route::apiResource('mesas', TableController::class);
// Ruta adicional para eliminación física de mesas
Route::delete('/mesas/{id}/force-delete', [TableController::class, 'forceDelete']);
// Rutas CRUD de pedidos (apiResource)
Route::apiResource('orders', OrderController::class);

// Rutas CRUD de usuarios (apiResource)
Route::apiResource('usuarios', UserController::class);
// Endpoints avanzados de usuarios
Route::post('/usuarios/{id}/change-pin', [UserController::class, 'changePin']);
Route::post('/usuarios/{id}/reset-pin', [UserController::class, 'resetPin']);
Route::post('/usuarios/{id}/set-session', [UserController::class, 'setActiveSession']);
Route::post('/usuarios/{id}/reactivate', [UserController::class, 'reactivate']);
Route::post('/usuarios/{id}/force-logout', [UserController::class, 'forceLogout']);

// Ruta de login (validación de usuario y pin)
Route::post('/login', [UserController::class, 'login']);
// Ruta de login de admin (Sanctum) - sin middleware web adicional
Route::post('/admin/login', [UserController::class, 'loginAdmin']);

// Ruta de prueba CORS
Route::get('/cors-test', function () {
    return response('ok', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Content-Type', 'application/json');
});

// Subida de imágenes a Cloudinary
Route::post('/cloudinary/upload', [CloudinaryImageController::class, 'upload']);

// --- Dispositivos autorizados y sistema global ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/devices/pending', [\App\Http\Controllers\Api\AuthorizedDeviceController::class, 'pending']);
    Route::post('/devices/approve', [\App\Http\Controllers\Api\AuthorizedDeviceController::class, 'approve']);
    Route::post('/devices/revoke', [\App\Http\Controllers\Api\AuthorizedDeviceController::class, 'revoke']);
    Route::post('/system/open', [\App\Http\Controllers\Api\SystemStatusController::class, 'open']);
    Route::post('/system/close', [\App\Http\Controllers\Api\SystemStatusController::class, 'close']);
});

// Endpoint de prueba para verificar sesión Sanctum y usuario autenticado
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});

// Ruta de prueba para verificar estado de sesión (accesible sin autenticación)
Route::get('/session-status', function () {
    return response()->json([
        'session_id' => session()->getId(),
        'session_started' => session()->isStarted(),
        'user_authenticated' => Auth::guard('web')->check(),
        'user_id' => Auth::guard('web')->id(),
        'user_name' => Auth::guard('web')->user()?->name ?? 'No autenticado',
        'csrf_token' => csrf_token(),
        'timestamp' => now()->format('Y-m-d H:i:s'),
        'cookies_received' => array_keys(request()->cookies->all()),
        'has_laravel_session' => request()->hasCookie('laravel_session'),
        'has_xsrf_token' => request()->hasCookie('XSRF-TOKEN'),
    ]);
});