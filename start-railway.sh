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

echo "Iniciando queue workers optimizados con prioridades..."
# Worker específico para cola de alta prioridad (impresión)
php artisan queue:work --queue=high,default --tries=3 --timeout=30 --sleep=0 --rest=0 --max-jobs=500 &
# Worker adicional para procesamiento general
php artisan queue:work --queue=default --tries=3 --timeout=30 --sleep=0 --rest=0 --max-jobs=500 &
# Worker adicional para máximo rendimiento
php artisan queue:work --queue=default --tries=3 --timeout=30 --sleep=0 --rest=0 --max-jobs=500 &
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
