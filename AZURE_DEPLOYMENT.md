# Guía de Despliegue en Azure - D'Brasas y Carbón

## Pre-requisitos

1. **Cuenta de Azure**: Tener una suscripción activa de Azure
2. **Azure CLI** (opcional): Para comandos desde terminal
3. **Archivos preparados**: Todo el código debe estar listo en GitHub

## Paso 1: Crear los recursos en Azure

### 1.1 Crear Azure Database for MySQL
```bash
# En Azure Portal o CLI
az mysql flexible-server create \
  --resource-group "rg-brasas-restaurant" \
  --name "server-brasas-mysql" \
  --location "East US 2" \
  --admin-user "brasas_admin" \
  --admin-password "TuPassword123!" \
  --sku-name "Standard_B1ms" \
  --tier "Burstable" \
  --public-access "All" \
  --storage-size 32
```

### 1.2 Crear base de datos
```sql
CREATE DATABASE brasas_restaurant;
```

### 1.3 Crear Azure Web App
```bash
az webapp create \
  --resource-group "rg-brasas-restaurant" \
  --plan "plan-brasas-app" \
  --name "dbrasas-restaurant-app" \
  --runtime "PHP:8.2" \
  --deployment-local-git
```

## Paso 2: Configurar Application Settings en Azure Portal

Ve a tu Web App > Configuration > Application Settings y agrega:

```
APP_NAME=D'Brasas y Carbón
APP_ENV=production
APP_KEY=base64:tTl/WCgz26W9lSOrdxcG/VtsC2CCke2VvolO/sJ+0Lw=
APP_DEBUG=false
APP_URL=https://tu-app.azurewebsites.net

DB_CONNECTION=mysql
DB_HOST=server-brasas-mysql.mysql.database.azure.com
DB_PORT=3306
DB_DATABASE=brasas_restaurant
DB_USERNAME=brasas_admin
DB_PASSWORD=TuPassword123!

CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_KEY=tu-api-key
CLOUDINARY_SECRET=tu-api-secret

PUSHER_APP_ID=tu-pusher-app-id
PUSHER_APP_KEY=tu-pusher-key
PUSHER_APP_SECRET=tu-pusher-secret
PUSHER_APP_CLUSTER=us2

SESSION_DOMAIN=.azurewebsites.net
SANCTUM_STATEFUL_DOMAINS=tu-app.azurewebsites.net
```

## Paso 3: Configurar Deployment

### Opción A: Desde GitHub (Recomendado)
1. Ve a Deployment Center en tu Web App
2. Selecciona "GitHub" como source
3. Autoriza y selecciona tu repositorio
4. Selecciona la rama main
5. Azure creará automáticamente el workflow de GitHub Actions

### Opción B: Git local
```bash
# Agregar Azure como remote
git remote add azure https://tu-app.scm.azurewebsites.net/tu-app.git

# Deploy
git push azure main
```

## Paso 4: Configuración post-deployment

### 4.1 Ejecutar migraciones
En Azure Portal > Console (o SSH):
```bash
cd /home/site/wwwroot
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder
```

### 4.2 Configurar storage link
```bash
php artisan storage:link
```

### 4.3 Limpiar caché
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Paso 5: Configurar Queue Worker (Opcional)

Para procesar trabajos en segundo plano:

1. Ve a WebJobs en tu App Service
2. Crea un nuevo WebJob:
   - Name: queue-worker
   - Type: Continuous
   - Upload: queue-worker.sh

## Paso 6: Configurar SSL y Dominio Personalizado

### 6.1 Habilitar HTTPS
1. Ve a TLS/SSL settings
2. Habilita "HTTPS Only"

### 6.2 Dominio personalizado (opcional)
1. Ve a Custom domains
2. Agrega tu dominio
3. Configura DNS records

## Paso 7: Configurar Monitoring y Logs

### 7.1 Application Insights
1. Habilita Application Insights
2. Configura alertas para errores

### 7.2 Log Stream
1. Ve a Log stream para ver logs en tiempo real

## Paso 8: Backup y Seguridad

### 8.1 Configurar backup automático
1. Ve a Backups
2. Configura backup schedule

### 8.2 Configurar firewall de base de datos
1. Ve a tu MySQL server
2. Configura reglas de firewall para tu App Service

## Verificaciones Finales

1. **Funcionalidad básica**: Login, crear pedidos, gestión de menú
2. **Base de datos**: Todas las tablas creadas correctamente
3. **Archivos estáticos**: CSS, JS, imágenes cargan correctamente
4. **WebSockets**: Pusher funciona para tiempo real
5. **Cloudinary**: Subida de imágenes funciona
6. **SSL**: HTTPS habilitado y funcionando

## Solución de problemas comunes

### Error 500 - Internal Server Error
```bash
# Ver logs detallados
az webapp log tail --name tu-app --resource-group tu-rg

# O en Azure Portal > Log stream
```

### Problemas de base de datos
```bash
# Verificar conexión
php artisan tinker
DB::connection()->getPdo();
```

### Problemas de permisos
```bash
# Verificar permisos de storage
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Cache issues
```bash
# Limpiar todo el cache
php artisan optimize:clear
```

## Comandos útiles para Azure CLI

```bash
# Ver logs
az webapp log tail --name tu-app --resource-group tu-rg

# Restart app
az webapp restart --name tu-app --resource-group tu-rg

# Ver configuration
az webapp config show --name tu-app --resource-group tu-rg

# Update app settings
az webapp config appsettings set --name tu-app --resource-group tu-rg --settings APP_DEBUG=false
```

## Variables de entorno importantes para Azure

```bash
# Rutas importantes en Azure App Service
DOCUMENT_ROOT=/home/site/wwwroot/public
HOME=/home/site/wwwroot
PATH=/opt/php/8.2/bin:$PATH

# Laravel specific
LARAVEL_ENV=production
```

¡Tu aplicación debería estar funcionando en Azure una vez completados todos estos pasos!
