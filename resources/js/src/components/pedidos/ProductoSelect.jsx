import React from 'react';

function ProductoSelect({ productos, value, onChange, error, loading }) {
  const activos = productos.filter(p => p.active);
  return (
    <span>
      <label htmlFor="producto-select">Producto:&nbsp;</label>
      {loading ? (
        <span style={{ color: '#ffd203', fontWeight: 600 }}>Cargando...</span>
      ) : error ? (
        <span style={{ color: 'red', fontWeight: 600 }}>{error}</span>
      ) : activos.length === 0 ? (
        <span style={{ color: '#ffd203', fontWeight: 600 }}>No hay productos disponibles</span>
      ) : (
        <select id="producto-select" value={value} onChange={onChange} style={{ border: error ? '2px solid #c00' : undefined, minWidth: 180, fontSize: 18, padding: 4 }}>
          <option value="">Selecciona producto</option>
          {activos.map(p => (
            <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
          ))}
        </select>
      )}
    </span>
  );
}

export default ProductoSelect;
