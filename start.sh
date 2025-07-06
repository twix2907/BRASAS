#!/bin/bash
set -e

# Solo migrar base de datos y cachear configuración
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# Iniciar servicios (PHP-FPM + Nginx)
exec "$@"