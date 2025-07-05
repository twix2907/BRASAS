import React from 'react';
import NuevoPedido from './NuevoPedido';
import { listarImpresoras, vistaPreviaTicket } from '../helpers/printTicket';

function Pedidos() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#ffd203' }}>Nuevo Pedido</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={listarImpresoras} style={{ background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>Ver impresoras disponibles</button>
        <button onClick={() => {
          // Ejemplo de datos de prueba para la vista previa
          const ejemplo = {
            mesa: '1',
            usuario: 'Admin',
            fecha: new Date().toLocaleString(),
            productos: [
              { cantidad: 2, nombre: 'Parrilla', subtotal: 120 },
              { cantidad: 1, nombre: 'Bebida', subtotal: 20, nota: 'Sin hielo' }
            ],
            total: 140
          };
          vistaPreviaTicket(ejemplo, 'ticket');
        }} style={{ background: '#232323', color: '#ffd203', fontWeight: 700, border: '2px solid #ffd203', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>
          Vista previa ticket
        </button>
      </div>
      <NuevoPedido />
    </div>
  );
}

export default Pedidos;
