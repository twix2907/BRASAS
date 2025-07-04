# Guía de diagnóstico y solución eficiente de problemas

1. No asumas, verifica siempre: revisa el código, estructura y contexto real antes de sugerir causas o soluciones.
2. Reproduce el problema y usa logs desde el inicio para confirmar el flujo y los datos reales.
3. Valida que la lógica relevante se ejecute donde y cuando debe: si algo solo falla en ciertos casos, revisa que esté activa en esos contextos.
4. Descarta lo que ya funciona: si una parte del sistema funciona, enfoca el diagnóstico en lo diferente.
5. Revisa la integración entre capas: valida que las partes del sistema estén alineadas en nombres, rutas, datos y lógica.
6. Haz cambios incrementales y prueba cada ajuste antes de seguir.
7. Documenta el hallazgo y la solución para evitar repetir el error.

> Aplica esta guía en TODO el ciclo de desarrollo y soporte del proyecto para evitar demoras y diagnósticos erróneos.

---

> **Regla crítica de validación previa:**  
> Antes de realizar cualquier cambio, sugerencia o integración, revisa si la funcionalidad, archivo o dependencia ya existe en el proyecto.  
> Si existe, reutiliza y mejora; si no, crea desde cero siguiendo la documentación oficial.  
> Nunca dupliques lógica, archivos ni dependencias.  
> Si tienes duda sobre la existencia o compatibilidad, consulta al usuario y detente hasta confirmar.


> **Regla obligatoria de layout y experiencia visual para todas las interfaces:**
>
> - Todas las vistas principales deben ocupar el 100% del viewport (ancho y alto), sin scroll global en la página (body/html) salvo en casos excepcionales justificados.
> - El área de contenido principal (formularios, paneles, listados) debe estar siempre centrada y alineada, sin espacios vacíos a los lados ni arriba/abajo, y debe ser responsiva.
> - Si hay un formulario y una lista, el formulario debe permanecer siempre visible y la lista debe ser scrollable solo dentro de su propio contenedor, adaptándose dinámicamente al espacio disponible.
> - Nunca uses márgenes, paddings o max-width en el contenedor raíz (#root) que generen espacios vacíos o desalineación visual.
> - El fondo y los colores deben cubrir todo el viewport, no solo el área del contenido.
>
> **Esta regla es prioritaria y debe aplicarse SIEMPRE en todas las vistas y módulos del sistema.**


**Regla obligatoria para el desarrollo y uso de integraciones, librerías y frameworks:**
>
> - Siempre debes seguir la documentación oficial más reciente de cada herramienta, librería, framework o API utilizada en el proyecto.
> - Nunca implementes, recomiendes ni modifiques código, configuraciones o integraciones basándote en suposiciones, experiencias previas, foros, blogs, respuestas de IA o ejemplos no verificados.
> - Si existe alguna duda, ambigüedad o posible cambio respecto a la versión o compatibilidad, debes advertirlo explícitamente y pedir confirmación al usuario antes de continuar.
> - No utilices métodos, opciones o patrones que no estén documentados oficialmente para la versión actual del proyecto.
> - Si la documentación oficial cambia, debes advertirlo y pedir confirmación antes de modificar la integración o el código.
>
> **Esta regla es prioritaria y debe aplicarse SIEMPRE, sin excepción, en todo el ciclo de desarrollo.**

---

> **Regla obligatoria para GitHub Copilot:**
>
> Si no tienes certeza absoluta de que una recomendación, archivo, configuración o fragmento de código es válido y compatible con la versión, tecnología o contexto actual del proyecto, DEBES indicarme claramente la duda o la posible desactualización y pedirme que lo confirme y lo busque en la **documentación oficial de la herramienta, framework o tecnología que se está utilizando** (por ejemplo, la documentación oficial de Laravel, Vue, React, etc.) antes de continuar.
>
> Bajo ninguna circunstancia asumas o sugieras prácticas, archivos, configuraciones o patrones que puedan estar obsoletos, ser incorrectos o no pertinentes para la versión actual. Esta regla es prioritaria y debes aplicarla en TODO momento, sin excepción.


> **Regla de verificación obligatoria para integraciones y dependencias externas:**
>
> Antes de sugerir, instalar, modificar o recomendar cualquier librería, paquete, API, integración externa o fragmento de código que dependa de una herramienta de terceros (por ejemplo: Cloudinary, Firebase, QZ Tray, Pusher, etc.), **debes consultar y validar siempre la documentación oficial y la compatibilidad con la versión actual del framework y del paquete**.
>
> - Si no tienes 100% de certeza de que la recomendación es válida y compatible con la versión actual del proyecto, **debes advertirlo explícitamente al usuario y pedirle que confirme en la documentación oficial antes de continuar**.
> - Nunca asumas que una librería, método o configuración sigue vigente o es igual a versiones anteriores.
> - Si el usuario no confirma o no valida en la documentación oficial, **no generes código ni instrucciones automáticas** para esa integración.
>
> **Esta regla es prioritaria y debe aplicarse SIEMPRE, sin excepción, en TODO el ciclo de desarrollo.**

---


> **Para contexto completo sobre alcance, reglas y arquitectura:**  
> Lee también [README.md](../README.md)

Este proyecto utiliza Laravel 12. Todas las instrucciones y configuraciones deben considerar los cambios y requisitos de esta versión.

> **Regla esencial:**  
> Antes de sugerir, crear o modificar código o archivos, **revisa siempre el contexto del proyecto**, incluyendo:
> - El código y archivos ya existentes  
> No dupliques recursos ni asumas que algo no existe: **verifica primero**.

# Guía para desarrollo incremental y con buenas prácticas

## Enfoque de desarrollo

- **Avance funcional mínimo viable:**  
  Siempre prioriza que existan flujos completos y funcionales aunque sean básicos (por ejemplo, poder crear un pedido de principio a fin).  
  No agregues extras hasta que lo esencial funcione y esté probado.
- **Iterativo e incremental:**  
  Cada nueva funcionalidad debe construirse sobre lo anterior, manteniendo el sistema funcionando.  
  Si el tiempo se acaba, al menos debe haber una versión básica y utilizable.
- **Buenas prácticas SIEMPRE:**  
  - Aplica principios SOLID, DRY, KISS y YAGNI.
  - Usa separación de capas (servicios, controladores, modelos, etc.).
  - Código limpio y legible, con comentarios solo donde realmente aporten.
  - Usa tests básicos (unitarios e integración) para flujos principales.
  - Nombres descriptivos para variables, funciones, clases y archivos.
  - Sin código innecesario, duplicado o dependiente de hacks temporales.
  - Sigue el estándar de estilo de Laravel y React.

## Orden recomendado de avance

1. **Autenticación y gestión de usuarios**  
   - Pantalla de login (selección de usuario + PIN).  
   - CRUD básico de usuarios (solo admin).
2. **Gestión de mesas**  
   - Listado, creación, edición e inhabilitación de mesas.
3. **Gestión de productos/menú**  
   - CRUD de productos/categorías, subida de imágenes (mock o Cloudinary).
4. **Gestión de pedidos**  
   - Crear, visualizar, cancelar y cerrar pedidos, asociar a mesa.
5. **Impresión automática (stub/mock al inicio)**  
   - Integración real con QZ Tray solo cuando lo anterior funcione.
6. **Reportes y otros módulos**  
   - Solo después de que lo anterior sea estable y funcional.

## Reglas adicionales

- Nunca mezcles commits de features diferentes.
- Cada PR debe ser pequeña, funcional y revisable.
- Documenta cualquier decisión técnica relevante.
- Si una funcionalidad no se puede terminar, deja el código funcional y bien comentado, sin romper nada.

---

**¡El objetivo es que en cada entrega el sistema sea funcional y de calidad, incluso si solo tiene lo básico!**

---

**Instrucción general para integraciones y configuración en cualquier proyecto:**

- Antes de sugerir, instalar o modificar cualquier dependencia, configuración o flujo, revisa SIEMPRE la documentación oficial y actualizada de la tecnología o herramienta utilizada.
- No asumas que las prácticas, archivos o métodos de versiones anteriores siguen siendo válidos en la versión actual.
- Prefiere siempre los mecanismos y patrones de configuración recomendados oficialmente para la versión y contexto del proyecto.
- Si tienes dudas sobre compatibilidad, cambios recientes o mejores prácticas, consulta la documentación oficial o pide confirmación antes de continuar.
- Documenta cualquier decisión técnica relevante para futuras referencias.

---