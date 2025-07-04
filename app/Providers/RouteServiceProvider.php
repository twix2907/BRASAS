<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        \Illuminate\Support\Facades\Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}
