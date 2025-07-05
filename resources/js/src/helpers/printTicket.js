// ...componente BotonPruebaImpresion movido a src/components/BotonPruebaImpresion.jsx...
import qz from 'qz-tray';

/**
 * Imprime un ticket o comanda usando QZ Tray (npm version)
 * @param {Object} printData - Datos estructurados del ticket (desde backend)
 * @param {('ticket'|'comanda')} tipo - Tipo de impresión
 * @param {string} [printerName] - Nombre de la impresora a usar (opcional)
 * @returns {Promise<void>}
 */
export async function printTicket(printData, tipo = 'ticket', printerName = 'RAW') {
  if (!qz) {
    alert('QZ Tray no está disponible. Por favor, asegúrate de que QZ Tray esté instalado y ejecutándose.');
    return;
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
    // Mostrar vista previa después de imprimir
    vistaPreviaTicket(printData, tipo);
  } catch (error) {
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
  let out = '';
  out += "D'Brasas y Carbón\n";
  out += 'El sabor auténtico a la brasa\n';
  out += '\n';
  out += `Ticket N°: ${data.id || '-'}\n`;
  out += '-------------------------------\n';
  if (tipo === 'ticket') {
    out += 'TICKET DE VENTA\n';
  } else {
    out += 'COMANDA\n';
  }
  out += `Tipo de pedido: ${data.tipo === 'mesa' ? 'Mesa' : data.tipo === 'para_llevar' ? 'Para llevar' : data.tipo === 'delivery' ? 'Delivery' : '-'}\n`;
  if (data.tipo === 'delivery' && data.client_name) {
    out += `Cliente: ${data.client_name}\n`;
  }
  if (data.tipo === 'delivery' && data.delivery_location) {
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
  (data.productos || []).forEach(p => {
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
  out += '\n';
  if (tipo === 'ticket') {
    out += '¡Gracias por su visita!\n';
  }
  out += '\n\n\n'; // Espacio para corte
  return out;
}

/**
 * Muestra una vista previa del ticket/comanda en pantalla (solo para pruebas)
 * @param {Object} printData - Datos estructurados del ticket (desde backend)
 * @param {('ticket'|'comanda')} tipo - Tipo de impresión
 */
export function vistaPreviaTicket(printData, tipo = 'ticket') {
  const contenido = formatearTicket(printData, tipo);
  // Mostrar en un modal simple o ventana nueva
  const win = window.open('', '_blank', 'width=400,height=600');
  win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">' + contenido.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
  win.document.title = 'Vista previa ticket';
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
