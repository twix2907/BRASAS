#!/bin/bash
set -e

# 1. Entrar a la carpeta de tu frontend (React)
cd resources/js

# 2. Instalar dependencias del frontend
npm install

# 3. Hacer el build del frontend (React)
npm run build

# 4. Volver a la raíz del proyecto
cd ../..

# 5. Instalar dependencias del backend (Laravel)
composer install --no-dev --optimize-autoloader

# 6. Migrar la base de datos (opcional, si usas migraciones)
php artisan migrate --force

# 7. Cachear configuración y rutas para producción
php artisan config:cache
php artisan route:cache

# 8. Iniciar el servidor de Laravel (usando el puerto que Railway asigna)
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}