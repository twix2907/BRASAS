#!/bin/bash

echo "=== Pre-deployment Check for D'Brasas y Carbón ==="
echo ""

# Check if required files exist
echo "1. Checking required files..."
files=(".env.production" "composer.json" "package.json" "web.config" "deploy.cmd")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
        exit 1
    fi
done

echo ""
echo "2. Checking Laravel configuration..."

# Check if APP_KEY is set in .env.production
if grep -q "APP_KEY=base64:" .env.production; then
    echo "✓ APP_KEY is configured"
else
    echo "✗ APP_KEY not configured in .env.production"
    echo "Run: php artisan key:generate"
    exit 1
fi

echo ""
echo "3. Checking database configuration..."

# Check database settings
if grep -q "DB_CONNECTION=mysql" .env.production; then
    echo "✓ Database connection configured"
else
    echo "✗ Database not configured in .env.production"
    exit 1
fi

echo ""
echo "4. Checking dependencies..."

# Check if composer.lock exists
if [ -f "composer.lock" ]; then
    echo "✓ Composer dependencies locked"
else
    echo "✗ Run 'composer install' to generate composer.lock"
    exit 1
fi

# Check if package-lock.json exists
if [ -f "package-lock.json" ]; then
    echo "✓ NPM dependencies locked"
else
    echo "✗ Run 'npm install' to generate package-lock.json"
    exit 1
fi

echo ""
echo "=== All checks passed! Ready for Azure deployment ==="
echo ""
echo "Next steps:"
echo "1. Create Azure Web App with PHP 8.2"
echo "2. Create Azure Database for MySQL"
echo "3. Configure Application Settings in Azure Portal"
echo "4. Deploy from GitHub or upload files"
echo "5. Run migrations: php artisan migrate --force"
