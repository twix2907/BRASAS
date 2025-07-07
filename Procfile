web: php artisan config:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
worker: php artisan queue:work --tries=3 --timeout=30 --sleep=0 --rest=0 --max-jobs=1000
