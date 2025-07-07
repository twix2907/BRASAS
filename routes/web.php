<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

// Health check para Railway
Route::get('/', function () {
    return 'OK - D\'Brasas y Carbón - ' . now();
});

// (El login por pin solo se gestiona por API, no aquí)

// Catch-all solo para rutas que NO sean assets ni API
Route::get('/{any}', function () {
    $path = public_path('build/index.html');
    if (File::exists($path)) {
        return Response::file($path);
    }
    abort(404);
})->where('any', '^(?!build|api|images|favicon\.ico|robots\.txt).*$');