import React from "react";
import Modal from "./ModalOrdenDetalle.jsx";

export default function ModalVistaPreviaTicket({ open, onClose, ticketData, tipo = 'comanda' }) {
  if (!open) return null;

  // Formato compacto SOLO para cocina: N° orden, mesa, productos y notas
  function formatearComandaCompacta(data) {
    let out = '';
    out += `ORDEN #${data.id || '-'}\n`;
    // Compatibilidad: aceptar "tipo" o "type"
    const tipoPedido = data.type || data.tipo;
    if (tipoPedido === 'para_llevar') {
      out += 'PARA LLEVAR\n';
    } else if (tipoPedido === 'delivery') {
      out += 'DELIVERY\n';
    } else if (data.mesa) {
      out += `MESA: ${data.mesa}\n`;
    }
    out += '---------------------\n';
    (data.productos || data.items || []).forEach(p => {
      const cantidad = p.cantidad ?? p.quantity ?? 0;
      const nombre = p.nombre ?? p.name ?? '';
      // Notas pueden venir como "notas", "nota" o "notes"
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

  return (
    <Modal open={open} onClose={onClose}>
      <h2 style={{ color: '#ffd203', textAlign: 'center', marginBottom: 12 }}>Vista previa comanda</h2>
      <pre style={{
        background: '#222',
        color: '#ffd203',
        fontSize: 16,
        lineHeight: 1.3,
        padding: 24,
        borderRadius: 10,
        minHeight: 120,
        maxHeight: 400,
        overflow: 'auto',
        marginBottom: 16
      }}>{formatearComandaCompacta(ticketData || {})}</pre>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            color: '#ffd203',
            border: '1px solid #ffd203',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >Cerrar</button>
        <button
          onClick={() => window.printTicket(ticketData, 'comanda')}
          style={{
            background: '#ffd203',
            color: '#010001',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >Imprimir</button>
      </div>
    </Modal>
  );
}
