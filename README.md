> **Nota importante:**  
> Este proyecto utiliza reglas y contexto especial para GitHub Copilot definidos en [`.github/copilot-instructions.md`](.github/copilot-instructions.md).  
> Por favor, revisa ese archivo antes de contribuir o generar código con IA.

# Sistema de Gestión para Restaurante “D'Brasas y Carbón”

## 1. Descripción General

Este proyecto es un sistema web integral para la gestión de un restaurante, diseñado específicamente para “D'Brasas y Carbón”. El objetivo es crear una plataforma moderna, rápida, de alta calidad y fácil de usar para el personal operativo (meseros, cajeros, administrador) que permita gestionar pedidos de mesa, para llevar y delivery, el menú, la impresión automática de comandas y tickets, usuarios y reportes, todo en tiempo real, con enfoque en simplicidad y excelente experiencia de usuario.

---

## 2. Identidad Visual y Personalización

- **Nombre del restaurante:** D'Brasas y Carbón (debe aparecer en la web y en tickets impresos, si es técnicamente sencillo)
- **Logo:** Archivo PNG, debe mostrarse en la web (cabecera, login, etc.) y, si es posible, en tickets impresos y como favicon del sitio.
- **Paleta de colores principal:**  
  - Amarillo: `#ffd203`
  - Negro: `#010001`
  - Blanco: `#fefeff`
  - (Se pueden añadir colores neutros o de acento que combinen bien, pero siempre respetando la paleta principal)
- **Modo de color:** Siempre oscuro (dark mode), con los colores anteriores como base.
- **Tipografía:** Moderna, legible, de estilo redondeado, similar a las que usa Google en sus aplicaciones/webs (ejemplo: Google Sans, Roboto, Nunito Sans, etc.)
- **Bienvenida/eslogan:** Debe incluir en la interfaz una bienvenida y eslogan personalizado (el eslogan puede ser: “El sabor auténtico a la brasa” o puedes sugerir uno).
- **Favicon:** Debe usarse el logo PNG como favicon.
- **Idioma:** Siempre en español, sin soporte multi-idioma.
- **No mostrar datos de contacto ni información adicional en la web ni en tickets.**

---

## 3. Módulos Funcionales y Requisitos Clave

### 3.1. Gestión de Pedidos

- Los usuarios pueden crear pedidos de mesa, para llevar y delivery, todos con el mismo catálogo de productos.
- Cada mesa solo puede tener un pedido activo a la vez.
- Los pedidos se confirman y quedan registrados solo al finalizar; si un mesero sale de la pantalla antes de confirmar, el pedido no se guarda.
- Los pedidos incluyen productos, cantidades y notas por producto.
- Validación obligatoria: no se puede confirmar un pedido sin productos.
- Un pedido cerrado (finalizado) no puede reabrirse ni editarse.
- Si un cliente pide la cuenta y luego desea agregar más, se debe crear un nuevo pedido.
- Los pedidos históricos siempre quedan guardados para reportes, aunque productos o mesas sean eliminados o inhabilitados.
- Solo los pedidos activos pueden reimprimir comandas/tickets; los históricos, no.
- Cancelar pedidos está permitido para cualquier usuario (mesero, cajero, admin).
- Todos los cambios (creación, cancelación, impresión) se reflejan en tiempo real en todos los dispositivos conectados.

### 3.2. Impresión de Comandas y Tickets

- Impresión automática de comanda en cocina al confirmar pedido o agregar platos adicionales.
- Impresión automática de cuenta/ticket en caja para el cliente.
- Se utiliza QZ Tray instalado en la PC conectada a la impresora para impresión directa (sin ventana del navegador).
- Si ocurre un error de impresión (sin papel, impresora apagada), el sistema muestra un mensaje y permite reintentar manualmente.
- No se almacena copia digital de tickets/comandas.
- El logo y nombre del restaurante deben aparecer en la cabecera de la web y en los tickets, si es técnicamente sencillo.

### 3.3. Gestión de Menú

- CRUD completo de productos: agregar, editar, eliminar, inhabilitar (“agotado”).
- Los productos eliminados o inhabilitados no se muestran en nuevos pedidos, pero sí en reportes e históricos.
- Cada producto puede tener imagen (se sube y redimensiona automáticamente vía Cloudinary).
- Los productos se agrupan por categorías (entradas, parrillas, guarniciones, bebidas, postres, etc.).
- No hay productos “ocultos” solo para admins.
- No existe restricción en la cantidad de productos ni categorías.

### 3.4. Gestión de Mesas

- CRUD de mesas (agregar, editar, inhabilitar).
- No se eliminan físicamente las mesas; solo se inhabilitan para mantener la integridad de los pedidos históricos.
- Estado de la mesa: “ocupada” o “libre”.
- No se permite cambiar un pedido de mesa.

### 3.5. Usuarios y Seguridad

- Login tipo "Netflix": se selecciona usuario y luego se ingresa PIN de 4 dígitos.
- Cada usuario puede cambiar su PIN (validando el anterior); el admin puede resetearlo.
- Solo el admin puede crear, editar, eliminar (inhabilitar) usuarios.
- Un usuario solo puede estar activo en un dispositivo a la vez.
- Los usuarios inhabilitados no pueden acceder, pero permanecen en históricos y reportes.
- No se permite borrado físico de usuarios.
- Acceso de admin protegido por 2FA soportado por Firebase.
- No hay bloqueo automático por intentos fallidos.
- Registro de acciones críticas para auditoría (opcional, si es sencillo de implementar).

---

## 4. Reportes y Visualización

- Panel de reportes accesible solo por el administrador.
- Reportes disponibles:
  - Ventas diarias, semanales, mensuales.
  - Productos más vendidos (por mes).
  - Ventas por usuario (mesero/cajero, por periodo).
  - Pedidos cancelados.
- Exportación de reportes a Excel o PDF (si es sencillo de implementar).
- Todos los reportes y búsquedas deben incluir productos inhabilitados y pedidos históricos, pero solo como “referencia” (no se pueden reactivar pedidos ni editar históricos).
- Búsqueda avanzada de pedidos por fecha, usuario, estado y tipo.
- Visualización de productos deshabilitados en reportes, siempre con marca diferenciadora.
- Panel de estado de conexión (si es sencillo de implementar) para mostrar si el sistema está “En línea” o “Desconectado”.

---

## 5. Arquitectura Técnica

### 5.1. Backend

- **Framework:** Laravel (PHP, monorepo)
- **API:** RESTful, protegida y documentada, endpoints claros para pedidos, menú, mesas, usuarios y reportes.
- **WebSockets:** Para tiempo real en pedidos, estado de mesas, productos y notificaciones de impresión (Pusher/Laravel Echo recomendado).
- **Base de datos:** MySQL (única opción soportada).
- **Autenticación:** 
  - Selección de usuario (tipo “Netflix”) + PIN de 4 dígitos.
  - 2FA solo para el admin, mediante el método soportado por Firebase Auth.
- **Gestión de imágenes:** Cloudinary para subida/redimensionado/almacenamiento de imágenes de productos.
- **Impresión:** Integración con QZ Tray en la PC de la impresora, para impresión automática y directa de comandas y tickets.

### 5.2. Frontend

- **Framework:** React (con Vite, en monorepo dentro de Laravel).
- **Estilo:** Modo oscuro, paleta basada en: #ffd203 (amarillo), #010001 (negro), #fefeff (blanco), con colores de acento que combinen.
- **Tipografía:** Moderna, legible, redondeada (Google Sans, Roboto o Nunito Sans).
- **UX/UI:** Ultra intuitivo, rápido, responsive para tablets y móviles, animaciones mínimas.
- **Logo:** Se muestra en login, cabecera y (si es sencillo) en tickets impresos y favicon.
- **Bienvenida/eslogan:** Mensaje de bienvenida y eslogan (“El sabor auténtico a la brasa”, editable si deseas).
- **Idioma:** Español siempre.

---

## 6. Calidad, Pruebas y Despliegue

- **Pruebas:** 
  - Unitarias y de integración para backend y frontend.
  - Pruebas de rendimiento: toda operación clave (confirmar pedido, crear usuario, imprimir) debe completarse en <2 segundos.
- **CI/CD:** 
  - GitHub Actions para test, build y despliegue (monorepo simplifica la configuración).
- **Backups:** 
  - Automáticos en la nube; el admin puede descargar backups manualmente.
- **Logs:** 
  - Visualización sencilla de logs para admin (si es fácil de implementar).
- **Infraestructura:** 
  - Despliegue en cloud económico y sencillo (ej: DigitalOcean, AWS Lightsail, Linode).
  - Instalación/despliegue sencillo; dockerización opcional si no complica.

---

## 7. Restricciones y Consideraciones

- No hay soporte multi-sucursal ni multi-idioma.
- No se muestran ni gestionan datos de contacto ni información legal.
- No hay integración con sistemas externos (contabilidad, facturación electrónica, etc.).
- No hay modo demo, tutorial interactivo, ni canal de soporte/feedback.
- No se permite personalización de colores más allá de la paleta base y el logo.
- No se borran históricos; productos y usuarios solo se inhabilitan, nunca se eliminan físicamente.
- El sistema es para uso exclusivo del staff, no para clientes.

---

## 8. Objetivo de Experiencia de Usuario

- El sistema debe ser simple, rápido y confiable.
- Todas las acciones deben sentirse inmediatas y reflejarse en tiempo real para todos los usuarios.
- La interfaz debe ser visualmente atractiva pero sin sobrecargar de colores o animaciones.
- Todo el flujo debe ser comprensible para cualquier usuario, incluso sin capacitación previa.

---

## 9. Ejemplo de Estructura de Carpetas (Monorepo)

```plaintext
├── app/                  # Backend (Laravel)
├── database/
├── public/
│   └── favicon.ico
├── resources/
│   ├── js/               # Frontend (React + Vite)
│   ├── views/            # Vistas Blade mínimas (si es necesario)
│   └── images/           # Imágenes locales (si aplica)
├── routes/
├── tests/                # Pruebas unitarias y de integración
├── .env
├── .env.example
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
└── README.md
```
---

## 10. Sugerencias de Librerías y Herramientas

- **Laravel:** laravel/websockets, laravel/sanctum (API auth)
- **React:** react-router, styled-components, axios, socket.io-client o laravel-echo
- **Cloudinary:** cloudinary npm package para frontend, cloudinary-laravel package para backend
- **QZ Tray:** para impresión directa automática
- **PDF/Excel:** dompdf/barryvdh para PDF, maatwebsite/excel para Excel (opcional)
- **Testing:** PHPUnit, Jest, Testing Library

---

## 11. Resumen Final

El sistema debe cubrir todas las necesidades operativas de “D'Brasas y Carbón” garantizando rapidez, simplicidad, robustez y una experiencia de usuario moderna, minimalista y 100% adaptada a la identidad visual del restaurante.  
No debe implementar funciones que no estén en este documento, y debe priorizar siempre la facilidad de uso y el rendimiento.

---
