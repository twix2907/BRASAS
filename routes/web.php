<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

// (El login por pin solo se gestiona por API, no aquí)

// Catch-all para SPA - incluyendo la ruta raíz
Route::get('/{any?}', function () {
    $path = public_path('build/index.html');
    if (File::exists($path)) {
        return Response::file($path);
    }
    abort(404);
})->where('any', '^(?!build|api|images|favicon\.ico|robots\.txt|up).*$');