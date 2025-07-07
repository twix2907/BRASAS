#!/bin/bash

echo "Iniciando configuración de Laravel..."

# Configurar Laravel
php artisan config:cache
php artisan migrate --force

echo "Laravel configurado correctamente"

# Función para manejar señales de terminación
cleanup() {
    echo "Recibida señal de terminación, cerrando procesos..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Capturar señales de terminación
trap cleanup SIGTERM SIGINT

echo "Iniciando queue worker..."
# Iniciar queue worker en background
php artisan queue:work --verbose --tries=3 --timeout=90 --sleep=3 --max-time=3600 &
WORKER_PID=$!

echo "Queue worker iniciado con PID: $WORKER_PID"

echo "Iniciando servidor web en puerto $PORT..."
# Iniciar servidor web
php artisan serve --host=0.0.0.0 --port=$PORT &
WEB_PID=$!

echo "Servidor web iniciado con PID: $WEB_PID"

# Esperar a que alguno de los procesos termine
wait $WEB_PID $WORKER_PID

echo "Algún proceso terminó, cerrando aplicación..."
