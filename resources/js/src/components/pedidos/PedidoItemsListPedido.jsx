import React from 'react';
import placeholderImage from '../../../public/placeholder_brasas.png';

// props: items, onQuitar, productos
const PedidoItemsListPedido = ({ items, onQuitar, productos }) => {
  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.length === 0 && (
        <div style={{ color: '#ffd203', fontSize: 18, textAlign: 'center', marginTop: 24 }}>No hay productos agregados</div>
      )}
      {items.map((item, idx) => {
        const prod = productos.find(p => p.id === item.product_id) || {};
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#181818', borderRadius: 12, padding: '0.7rem 1.1rem', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)' }}>
            <img
              src={prod.image_url || placeholderImage}
              alt={prod.name || 'Producto'}
              style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, background: '#333' }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#ffd203', fontWeight: 700, fontSize: 16 }}>{prod.name || 'Producto'}</span>
              <span style={{ color: '#fffbe7', fontWeight: 600, fontSize: 15 }}>x{item.quantity} &bull; S/ {Number(prod.price || 0).toFixed(2)}</span>
              {item.notes && <span style={{ color: '#aaa', fontSize: 14, marginTop: 2 }}>Nota: {item.notes}</span>}
            </div>
            <button onClick={() => onQuitar(idx)} style={{ background: 'none', border: 'none', color: '#ff4d4f', fontSize: 22, fontWeight: 900, cursor: 'pointer', marginLeft: 8 }} title="Quitar producto" aria-label="Quitar producto">×</button>
          </div>
        );
      })}
    </div>
  );
};

export default PedidoItemsListPedido;
