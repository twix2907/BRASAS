
import React from 'react';

// items: [{ product_id, name, quantity, price, notes }]
// productos: [{ id, image_url }]
function PedidoItemsList({ items, quitarItem, productos }) {
  return (
    <ul style={{ marginBottom: 12, fontSize: 17 }}>
      {items.map((item, idx) => {
        // Buscar la imagen del producto
        const prod = productos?.find(p => p.id === item.product_id);
        const hasImage = !!prod?.image_url;
        const imgUrl = hasImage ? prod.image_url : '/logo_brasas.jpg';
        return (
          <li key={idx} style={{ color: '#fff', marginBottom: 4, display: 'flex', alignItems: 'center' }}>
            <img
              src={imgUrl}
              alt={item.name}
              style={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: 8,
                marginRight: 10,
                background: '#222',
                filter: hasImage ? 'none' : 'grayscale(1)',
                opacity: hasImage ? 1 : 0.7
              }}
              loading="lazy"
            />
            <span>{item.quantity} x {item.name} (${item.price}) {item.notes && <span>({item.notes})</span>}</span>
            <button type="button" aria-label="Quitar producto" onClick={() => quitarItem(idx)} style={{ marginLeft: 8, color: '#fff', background: '#c00', border: 'none', borderRadius: 4, padding: '0.2rem 0.7rem', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Quitar</button>
          </li>
        );
      })}
    </ul>
  );
}

export default PedidoItemsList;
