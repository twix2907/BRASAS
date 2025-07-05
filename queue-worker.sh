# Azure WebJob for Laravel Queue Worker
# This file helps Azure run the queue worker as a background process

# Queue worker command
cd /home/site/wwwroot && php artisan queue:work --verbose --tries=3 --timeout=90
