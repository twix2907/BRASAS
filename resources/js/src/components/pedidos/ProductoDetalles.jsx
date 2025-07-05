import React from 'react';
import placeholderImage from '../../../public/placeholder_brasas.png';

// props: producto (objeto completo del producto seleccionado)
const ProductoDetalles = ({ producto }) => {
  if (!producto) {
    return (
      <div style={{
        width: '100%',
        maxWidth: 340,
        padding: '1.5rem',
        background: '#181818',
        borderRadius: 16,
        border: '2px solid #333',
        textAlign: 'center'
      }}>
        <div style={{ color: '#aaa', fontSize: 16, fontWeight: 600 }}>
          Selecciona un producto para ver sus detalles
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 320,
      padding: '1rem',
      background: '#181818',
      borderRadius: 16,
      border: '2px solid #ffd203',
      boxShadow: '0 4px 12px 0 rgba(255,210,3,0.15)',
      boxSizing: 'border-box'
    }}>
      {/* Imagen del producto */}
      <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
        <img
          src={producto.image_url || placeholderImage}
          alt={producto.name}
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: 12,
            background: '#333',
            border: '2px solid #ffd203'
          }}
        />
      </div>

      {/* Nombre del producto */}
      <div style={{
        color: '#ffd203',
        fontSize: 18,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '0.4rem',
        lineHeight: 1.2
      }}>
        {producto.name}
      </div>

      {/* Descripción */}
      {producto.description && (
        <div style={{
          color: '#ccc',
          fontSize: 13,
          lineHeight: 1.3,
          textAlign: 'center',
          marginBottom: '0.6rem'
        }}>
          {producto.description}
        </div>
      )}

      {/* Precio */}
      <div style={{
        color: '#fffbe7',
        fontSize: 20,
        fontWeight: 700,
        textAlign: 'center'
      }}>
        S/ {Number(producto.price || 0).toFixed(2)}
      </div>
    </div>
  );
};

export default ProductoDetalles;
