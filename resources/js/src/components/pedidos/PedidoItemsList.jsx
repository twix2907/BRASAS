import React from 'react';

function PedidoItemsList({ items, quitarItem }) {
  return (
    <ul style={{ marginBottom: 12, fontSize: 17 }}>
      {items.map((item, idx) => (
        <li key={idx} style={{ color: '#fff', marginBottom: 4, display: 'flex', alignItems: 'center' }}>
          <span>{item.quantity} x {item.name} (${item.price}) {item.notes && <span>({item.notes})</span>}</span>
          <button type="button" aria-label="Quitar producto" onClick={() => quitarItem(idx)} style={{ marginLeft: 8, color: '#fff', background: '#c00', border: 'none', borderRadius: 4, padding: '0.2rem 0.7rem', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Quitar</button>
        </li>
      ))}
    </ul>
  );
}

export default PedidoItemsList;
