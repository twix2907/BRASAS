#!/bin/bash
# Salir si algo falla
set -e

# 1. Entrar a la carpeta de tu frontend (ajusta si tu carpeta se llama distinto)
cd js

# 2. Instalar dependencias de React
npm install

# 3. Hacer el build del frontend
npm run build

# 4. Volver a la raíz del proyecto
cd ..

# 5. Instalar dependencias de Laravel
composer install --no-dev --optimize-autoloader

# 6. Migrar la base de datos (opcional, solo si usas migraciones)
php artisan migrate --force

# 7. Cachear configuración y rutas para producción
php artisan config:cache
php artisan route:cache

# 8. Iniciar el servidor de Laravel (puedes cambiar el puerto si Railway lo requiere)
php artisan serve --host=0.0.0.0 --port=8000