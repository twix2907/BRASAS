// ...componente BotonPruebaImpresion movido a src/components/BotonPruebaImpresion.jsx...
import qz from 'qz-tray';

/**
 * Imprime un ticket o comanda usando QZ Tray (npm version)
 * @param {Object} printData - Datos estructurados del ticket (desde backend)
 * @param {('ticket'|'comanda')} tipo - Tipo de impresión
 * @param {string} [printerName] - Nombre de la impresora a usar (opcional)
 * @returns {Promise<void>}
 */
export async function printTicket(printData, tipo = 'ticket', printerName = 'RAW', winVistaPrevia = null) {
  if (!qz) {
    alert('QZ Tray no está disponible. Por favor, asegúrate de que QZ Tray esté instalado y ejecutándose.');
    return;
  }

  // Abrir la ventana de vista previa inmediatamente (si no se pasó una)
  let win = winVistaPrevia;
  if (!win) {
    win = window.open('', '_blank', 'width=400,height=600');
    if (win) {
      win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">Cargando ticket...</pre>');
      win.document.title = 'Vista previa ticket';
    }
  }

  try {
    // Solicitar permiso si es la primera vez
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }
    // Usa la impresora especificada o la predeterminada
    const config = qz.configs.create(printerName);
    // Construir el contenido del ticket (texto plano, ESC/POS, o HTML según impresora)
    const contenido = formatearTicket(printData, tipo);

    // Enviar a imprimir
    await qz.print(config, [{ type: 'raw', format: 'plain', data: contenido }]);
    // Mostrar vista previa (rellenar la ventana ya abierta)
    if (win) {
      win.document.body.innerHTML = '';
      win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">' + contenido.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
      win.document.title = 'Vista previa ticket';
    }
  } catch (error) {
    if (win) {
      win.document.body.innerHTML = '';
      win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">Error al imprimir o mostrar ticket.\n' + (error?.message || '') + '</pre>');
      win.document.title = 'Vista previa ticket';
    }
    alert('Error al imprimir: ' + error.message);
    throw error;
  } finally {
    if (qz.websocket.isActive()) {
      qz.websocket.disconnect();
    }
  }
}

/**
 * Formatea el contenido del ticket/comanda para impresión.
 * Puedes personalizar el formato aquí (logo, alineación, etc.)
 */
function formatearTicket(data, tipo) {
  // SOLO formato compacto para comanda/ticket cocina
  let out = '';
  out += `ORDEN #${data.id || '-'}\n`;
  // Mostrar tipo de pedido
  if (data.type === 'para_llevar') {
    out += 'PARA LLEVAR\n';
  } else if (data.type === 'delivery') {
    out += 'DELIVERY\n';
  } else if (data.mesa) {
    out += `MESA: ${data.mesa}\n`;
  }
  out += '---------------------\n';
  (data.productos || data.items || []).forEach(p => {
    const cantidad = p.cantidad ?? p.quantity ?? 0;
    const nombre = p.nombre ?? p.name ?? '';
    const nota = p.notas || p.nota || p.notes || '';
    out += `${cantidad} x ${nombre}`;
    if (nota && String(nota).trim() !== '') {
      // Formatear la nota para que no exceda 22 caracteres por línea, guion al final si rebasa
      const maxLen = 22;
      const notaStr = String(nota);
      let idx = 0;
      while (idx < notaStr.length) {
        let chunk = notaStr.slice(idx, idx + maxLen);
        // Si hay más texto después, poner guion al final
        if (chunk.length === maxLen && idx + maxLen < notaStr.length) {
          chunk = chunk.slice(0, maxLen - 1) + '-';
        }
        out += `\n   ${chunk}`;
        idx += maxLen;
      }
    }
    out += '\n';
  });
  out += '\n';
  return out;
}

/**
 * Muestra una vista previa del ticket/comanda en pantalla (solo para pruebas)
 * @param {Object} printData - Datos estructurados del ticket (desde backend)
 * @param {('ticket'|'comanda')} tipo - Tipo de impresión
 */
export function vistaPreviaTicket(printData, tipo = 'ticket', winVistaPrevia = null) {
  const contenido = formatearTicket(printData, tipo);
  let win = winVistaPrevia;
  if (!win) {
    win = window.open('', '_blank', 'width=400,height=600');
  }
  if (win) {
    win.document.body.innerHTML = '';
    win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">' + contenido.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
    win.document.title = 'Vista previa ticket';
  }
}

/**
 * Imprime un ticket de venta tradicional (para cajero, después de una venta)
 * @param {Object} printData - Datos estructurados del ticket (desde backend)
 * @param {string} [printerName] - Nombre de la impresora a usar (opcional)
 * @returns {Promise<void>}
 */
export async function printTicketVenta(printData, printerName = 'RAW', winVistaPrevia = null) {
  if (!qz) {
    alert('QZ Tray no está disponible. Por favor, asegúrate de que QZ Tray esté instalado y ejecutándose.');
    return;
  }
  let win = winVistaPrevia;
  if (!win) {
    win = window.open('', '_blank', 'width=400,height=600');
    if (win) {
      win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">Cargando ticket...</pre>');
      win.document.title = 'Vista previa ticket';
    }
  }
  try {
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }
    const config = qz.configs.create(printerName);
    const contenido = formatearTicketVenta(printData);
    await qz.print(config, [{ type: 'raw', format: 'plain', data: contenido }]);
    if (win) {
      win.document.body.innerHTML = '';
      win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">' + contenido.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
      win.document.title = 'Vista previa ticket';
    }
  } catch (error) {
    if (win) {
      win.document.body.innerHTML = '';
      win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">Error al imprimir o mostrar ticket.\n' + (error?.message || '') + '</pre>');
      win.document.title = 'Vista previa ticket';
    }
    alert('Error al imprimir: ' + error.message);
    throw error;
  } finally {
    if (qz.websocket.isActive()) {
      qz.websocket.disconnect();
    }
  }
}

/**
 * Vista previa de ticket de venta tradicional (para cajero)
 */
export function vistaPreviaTicketVenta(printData, winVistaPrevia = null) {
  // --- Normaliza productos para el formato de ticket de venta ---
  if (printData.items && !printData.productos) {
    printData.productos = printData.items.map(item => ({
      cantidad: item.cantidad ?? item.quantity ?? 0,
      nombre: item.nombre ?? item.name ?? (item.product ? item.product.name : ''),
      subtotal: typeof item.subtotal === 'number' ? item.subtotal : (item.price ?? 0) * (item.quantity ?? 0),
      nota: item.nota ?? item.notes ?? ''
    }));
  }
  const contenido = formatearTicketVenta(printData, 'ticket');
  let win = winVistaPrevia;
  if (!win) {
    win = window.open('', '_blank', 'width=400,height=600');
  }
  if (win) {
    win.document.body.innerHTML = '';
    win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">' + contenido.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
    win.document.title = 'Vista previa ticket';
  }
}

/**
 * Formato tradicional de ticket de venta (más detallado)
 */
function formatearTicketVenta(data) {
  let out = "";
  out += "D'Brasas y Carbón\n";
  out += 'El sabor auténtico a la brasa\n';
  out += '\n';
  out += `Ticket N°: ${data.id || '-'}\n`;
  out += '-------------------------------\n';
  out += 'TICKET DE VENTA\n';
  const tipoPedido = data.tipo || data.type;
  out += `Tipo de pedido: ${tipoPedido === 'mesa' ? 'Mesa' : tipoPedido === 'para_llevar' ? 'Para llevar' : tipoPedido === 'delivery' ? 'Delivery' : '-'}\n`;
  if (tipoPedido === 'delivery' && data.client_name) {
    out += `Cliente: ${data.client_name}\n`;
  }
  if (tipoPedido === 'delivery' && data.delivery_location) {
    out += `Ubicación: ${data.delivery_location}\n`;
  }
  if (data.mesa) {
    out += `Mesa: ${data.mesa}\n`;
  }
  out += `Atiende: ${data.usuario && data.usuario.name ? data.usuario.name : '-'}\n`;
  out += `Fecha: ${data.fecha || '-'}\n`;
  out += '-------------------------------\n';
  out += 'Cant  Producto           Subtotal\n';
  out += '-------------------------------\n';
  (data.productos || data.items || []).forEach(p => {
    const cantidad = p.cantidad ?? p.quantity ?? 0;
    const nombre = p.nombre ?? p.name ?? '';
    // Subtotal seguro
    let subtotal = p.subtotal;
    if (typeof subtotal !== 'number') {
      const precio = p.precio ?? p.price ?? 0;
      subtotal = precio * cantidad;
    }
    out += `${cantidad.toString().padEnd(4)} ${nombre.padEnd(18)} S/${Number(subtotal).toFixed(2)}\n`;
    if (p.nota || p.notes) out += `  Nota: ${p.nota || p.notes}\n`;
  });
  out += '-------------------------------\n';
  const total = typeof data.total === 'number' ? data.total : Number(data.total) || 0;
  out += `TOTAL: S/${total.toFixed(2)}\n`;
  out += '¡Gracias por su visita!\n';
  out += '\n\n\n'; // Espacio para corte
  return out;
}

// Utilidad para listar impresoras disponibles (puedes llamarla desde consola o un botón temporal)
export async function listarImpresoras() {
  if (!qz) {
    alert('QZ Tray no está disponible.');
    return;
  }
  try {
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }
    const printers = await qz.printers.find();
    alert('Impresoras disponibles:\n' + printers.join('\n'));
    return printers;
  } catch (err) {
    alert('Error al listar impresoras: ' + err.message);
    return [];
  } finally {
    if (qz.websocket.isActive()) {
      qz.websocket.disconnect();
    }
  }
}

// Asegura que las funciones estén disponibles en window para compatibilidad legacy
if (typeof window !== 'undefined') {
  window.vistaPreviaTicketVenta = vistaPreviaTicketVenta;
  window.printTicketVenta = printTicketVenta;
}
