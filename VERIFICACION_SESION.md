# Guía para Verificar que la Sesión se Mantiene

## 1. Verificación en DevTools del Navegador

### A) Verificar que las cookies existen y son válidas:
1. Abre DevTools (F12)
2. Ve a la pestaña **Application** > **Storage** > **Cookies** > **http://localhost:8000**
3. Verifica que existan estas cookies:
   - `laravel_session` (debe tener un valor largo cifrado)
   - `XSRF-TOKEN` (debe tener un valor largo cifrado)

### B) Verificar que las cookies cambian pero mantienen la sesión:
1. Anota los valores actuales de las cookies
2. Realiza una acción (confirmar pedido, crear usuario, etc.)
3. Verifica que:
   - ✅ Las cookies pueden cambiar (esto es NORMAL por seguridad)
   - ✅ Sigues autenticado (no te redirige al login)
   - ✅ Puedes seguir realizando acciones sin problemas

## 2. Verificación de Persistencia de Usuario

### A) Verificar localStorage:
1. En DevTools > **Application** > **Local Storage** > **http://localhost:3000**
2. Verifica que existe la clave `usuario` con tus datos de sesión

### B) Verificar que el usuario persiste:
1. Realiza una acción (confirmar pedido)
2. Verifica que el nombre de usuario sigue apareciendo en la interfaz
3. Verifica que puedes acceder a secciones protegidas

## 3. Verificación con Console del Navegador

Puedes ejecutar estos comandos en la consola del navegador:

```javascript
// Verificar si hay usuario en localStorage
console.log('Usuario:', JSON.parse(localStorage.getItem('usuario')));

// Verificar cookies actuales
console.log('Cookies:', document.cookie);

// Hacer una petición de prueba para ver si la sesión funciona
fetch('/api/usuarios', { credentials: 'include' })
  .then(r => r.json())
  .then(data => console.log('Sesión válida:', data))
  .catch(err => console.log('Error de sesión:', err));
```

## 4. Verificación Funcional

### Prueba estos flujos completos:
1. **Login** → **Confirmar pedido** → **Crear usuario** → **Editar producto**
2. **Login** → **Navegar entre secciones** → **Realizar múltiples acciones**
3. **Login** → **Dejar la app abierta 10 minutos** → **Realizar una acción**

### ✅ La sesión está funcionando correctamente si:
- No te redirige al login entre acciones
- Puedes realizar todas las operaciones sin errores 419
- El nombre de usuario permanece visible
- No pierdes datos de localStorage

### ❌ Hay problemas de sesión si:
- Te redirige al login inesperadamente
- Obtienes errores 419 frecuentes
- Pierdes el usuario de localStorage
- No puedes realizar acciones consecutivas

## 5. Verificación en Logs del Servidor

Si tienes acceso a los logs de Laravel, puedes ver:

```bash
php artisan serve --verbose
```

Y verificar que no aparezcan errores de sesión o CSRF en tiempo real.

## Conclusión

**ES NORMAL** que las cookies `laravel_session` y `XSRF-TOKEN` cambien entre peticiones. Esto es una característica de seguridad de Laravel/Sanctum.

**LO IMPORTANTE** es que:
1. Las peticiones funcionen (✅ ya confirmado)
2. El usuario no pierda la sesión (✅ verificar con los pasos anteriores)
3. No aparezcan errores 419 (✅ ya solucionado)

Si todos estos puntos se cumplen, tu aplicación está funcionando **perfectamente**.
