#!/bin/bash

echo "=== D'Brasas y Carbón - Azure Deployment Status Check ==="
echo ""

# Check if app is accessible
echo "1. Checking application accessibility..."
if curl -s -o /dev/null -w "%{http_code}" https://dbrasasapp-a4b6d4cjdyghfmcx.eastus2-01.azurewebsites.net/ | grep -q "200"; then
    echo "✓ Application is accessible"
else
    echo "✗ Application is not accessible"
fi

echo ""
echo "2. Checking database connectivity..."
# This would need to be run from Azure console
echo "Run from Azure Console: php artisan tinker"
echo "Then: DB::connection()->getPdo();"

echo ""
echo "3. Key URLs to test:"
echo "- Main app: https://dbrasasapp-a4b6d4cjdyghfmcx.eastus2-01.azurewebsites.net/"
echo "- API health: https://dbrasasapp-a4b6d4cjdyghfmcx.eastus2-01.azurewebsites.net/api/health"
echo "- Login: https://dbrasasapp-a4b6d4cjdyghfmcx.eastus2-01.azurewebsites.net/login"

echo ""
echo "4. Azure Portal checks:"
echo "- Go to App Service > Log stream to see real-time logs"
echo "- Check Application settings are configured"
echo "- Verify SSL certificate is active"
echo "- Check custom domain (if configured)"

echo ""
echo "5. Database checks:"
echo "- Verify MySQL server is running"
echo "- Check firewall rules allow App Service"
echo "- Confirm connection string is correct"

echo ""
echo "6. Performance checks:"
echo "- Monitor Application Insights"
echo "- Check resource usage in Metrics"
echo "- Verify auto-scaling settings"
