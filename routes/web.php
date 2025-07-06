<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

// (El login por pin solo se gestiona por API, no aquí)

Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');