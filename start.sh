#!/bin/bash

# Ejecutar migraciones y cache
php artisan config:cache
php artisan migrate --force

# Iniciar queue worker en segundo plano
php artisan queue:work --verbose --tries=3 --timeout=90 --daemon &

# Iniciar servidor web
php artisan serve --host=0.0.0.0 --port=$PORT
