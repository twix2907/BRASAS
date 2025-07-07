<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrustRailwayProxies
{
    public function handle(Request $request, Closure $next): Response
    {
        // Confiar en todos los proxies de Railway
        $request->setTrustedProxies(
            ['*'], 
            Request::HEADER_X_FORWARDED_FOR | 
            Request::HEADER_X_FORWARDED_HOST | 
            Request::HEADER_X_FORWARDED_PORT | 
            Request::HEADER_X_FORWARDED_PROTO
        );
        
        return $next($request);
    }
}
