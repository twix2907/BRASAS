web: php artisan config:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
worker: php artisan queue:work --verbose --tries=3 --timeout=90 --sleep=3
