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
      padding: '1.2rem',
      background: '#181818',
      borderRadius: 16,
      border: '2px solid #ffd203',
      boxShadow: '0 4px 12px 0 rgba(255,210,3,0.15)',
      boxSizing: 'border-box'
    }}>
      {/* Imagen del producto */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img
          src={producto.image_url || placeholderImage}
          alt={producto.name}
          style={{
            width: 100,
            height: 100,
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
        fontSize: 20,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '0.5rem',
        lineHeight: 1.3
      }}>
        {producto.name}
      </div>

      {/* Precio */}
      <div style={{
        color: '#fffbe7',
        fontSize: 24,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        S/ {Number(producto.price || 0).toFixed(2)}
      </div>

      {/* Categoría */}
      {producto.category && (
        <div style={{
          display: 'inline-block',
          background: '#ffd203',
          color: '#010001',
          padding: '0.3rem 0.8rem',
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
          marginBottom: '1rem',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          {producto.category}
        </div>
      )}

      {/* Descripción */}
      {producto.description && (
        <div style={{
          color: '#ccc',
          fontSize: 15,
          lineHeight: 1.4,
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          {producto.description}
        </div>
      )}
    </div>
  );
};

export default ProductoDetalles;
