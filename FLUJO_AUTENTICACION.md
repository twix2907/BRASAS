# Flujo de Autenticación Doble - D'Brasas y Carbón

## Resumen
Se ha implementado un sistema de autenticación de doble nivel donde primero debe autenticarse el administrador en cada dispositivo/navegador, y luego los trabajadores pueden acceder con su PIN.

## Funcionamiento

### 1. Primera Apertura de la Aplicación
- Al abrir la app en un navegador por primera vez (o después de limpiar datos), aparece la pantalla de **AdminGateway**
- Se requiere email + contraseña del administrador
- Si el admin tiene 2FA configurado en Firebase, se solicita verificación SMS
- Una vez autenticado, se guarda `admin_authenticated: true` en localStorage

### 2. Acceso de Trabajadores
- Después de la autenticación del admin, aparece la pantalla normal de **Login** para trabajadores
- Los trabajadores seleccionan su usuario y ingresan su PIN de 4 dígitos
- Funciona igual que antes, pero solo está disponible si el admin ya se autenticó

### 3. Persistencia
- El estado de "admin autenticado" es **permanente** hasta que:
  - Se borren los datos del navegador (localStorage)
  - Se haga clic en el botón "🔒 Cerrar Sesión Admin"
- No expira por tiempo, solo por acción manual

### 4. Botón de Cierre de Sesión Admin
- Aparece en la esquina superior derecha de todas las pantallas
- Al hacer clic, borra toda la autenticación y vuelve a mostrar AdminGateway
- Cierra tanto la sesión del admin como la del trabajador actual

## Archivos Principales

### Frontend
- `components/auth/AdminGateway.jsx` - Pantalla de login del admin con 2FA
- `components/auth/MainApp.jsx` - Componente que maneja el flujo completo
- `main.jsx` - Modificado para usar la nueva estructura
- `App.jsx` - Limpiado, ya no muestra login MFA directamente

### Backend
- La API `/api/admin/login` ya existía en `UserController.php`
- Firebase Auth maneja el 2FA (si está configurado)
- Sanctum maneja la sesión del admin en el backend

## Estados Posibles

1. **Sin autenticación**: Se muestra AdminGateway
2. **Solo admin autenticado**: Se muestra Login de trabajadores + botón "Cerrar Admin"
3. **Ambos autenticados**: Se muestra la aplicación normal + botón "Cerrar Admin"

## Seguridad

- El admin debe tener un usuario con `role: 'admin'` en la base de datos
- Debe tener email y password (no PIN)
- Opcionalmente puede tener 2FA configurado en Firebase
- El localStorage se usa solo para recordar que el admin ya se autenticó en este navegador
- La sesión real del admin se maneja con Sanctum en el backend

## Notas de Desarrollo

- El flujo es completamente transparente para los trabajadores
- No afecta el funcionamiento normal del sistema una vez configurado
- El admin puede seguir usando su PIN dentro del sistema (en el perfil de admin) además del login con email/contraseña
- Es compatible con todos los módulos existentes del sistema
