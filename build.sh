#!/bin/bash

echo "=== RAILWAY BUILD SCRIPT ==="
echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "Installing Node.js dependencies and building frontend..."
cd resources/js
npm install
npm run build
cd ../..

echo "Build completed successfully!"
cd ../..

echo "Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== BUILD COMPLETE ==="
