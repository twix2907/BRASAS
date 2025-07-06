<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login'],

    'allowed_methods' => ['*'],

    // Solo permitir el origen de tu frontend Vite (React)
    'allowed_origins' => [
        'https://brasas-production.up.railway.app', // <--- Tu dominio real en Railway
        'http://localhost:5173',    // (Opcional: para desarrollo local con Vite)
        'http://127.0.0.1:8000',    // (Opcional: para pruebas locales)
        'http://localhost:8000',    // (Opcional)
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Permitir credenciales (cookies) para Sanctum
    'supports_credentials' => true,

];
