#!/bin/bash
# ARCHIVO OBSOLETO - Usar start-railway.sh en su lugar
# Este archivo se mantiene solo por compatibilidad

echo "ADVERTENCIA: Usando start.sh obsoleto, se recomienda usar start-railway.sh"

# Configurar Laravel
php artisan config:cache
php artisan migrate --force

# Iniciar queue worker optimizado
php artisan queue:work --queue=high,default --tries=3 --timeout=30 --sleep=0 --rest=0 &

# Iniciar servidor web
php artisan serve --host=0.0.0.0 --port=$PORT
