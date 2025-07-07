#!/bin/bash

# Ejecutar migraciones y cache
php artisan config:cache
php artisan migrate --force

# Iniciar queue worker en segundo plano (sin --daemon que está deprecado)
php artisan queue:work --verbose --tries=3 --timeout=90 --sleep=3 &

# Iniciar servidor web
php artisan serve --host=0.0.0.0 --port=$PORT
