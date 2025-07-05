import React from 'react';
import placeholderImage from '../../../public/placeholder_brasas.png';

// props: productos, filtro, onFiltroChange, onAgregar, productoSeleccionado

const ProductosGrid = ({ productos, filtro, onFiltroChange, onAgregar, productoSeleccionado, onSelect }) => {
  // Filtro local por nombre/categoría
  const [busqueda, setBusqueda] = React.useState(filtro || '');
  const productosFiltrados = productos.filter(p =>
    (p.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.category?.toLowerCase().includes(busqueda.toLowerCase()))) && p.active
  );

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Sección superior: Buscador (fijo) */}
      <div style={{
        flexShrink: 0,
        marginBottom: 18
      }}>
        <label htmlFor="busqueda-producto" style={{ color: '#ffd203', fontWeight: 700, fontSize: 18, marginBottom: 4, display: 'block' }}>Buscar producto o categoría</label>
        <input
          id="busqueda-producto"
          type="text"
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); onFiltroChange?.(e.target.value); }}
          placeholder="Ej: parrilla, bebida, postre..."
          style={{
            borderRadius: 12,
            border: '2px solid #ffd203',
            padding: '0.7em 1.1em',
            fontSize: 18,
            background: '#232323',
            color: '#ffd203',
            outline: 'none',
            fontFamily: 'Nunito Sans, Roboto, Arial, sans-serif',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Tabla de productos */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
          <thead>
            <tr style={{ background: '#181818' }}>
              <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203' }}>Imagen</th>
              <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'left', borderBottom: '2px solid #ffd203' }}>Nombre</th>
              <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203' }}>Precio</th>
              <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203' }}>Agregar</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: '#ffd203', fontSize: 18, textAlign: 'center', padding: 24 }}>No hay productos</td>
              </tr>
            )}
            {productosFiltrados.map(prod => {
              const seleccionado = prod.id === Number(productoSeleccionado);
              return (
                <tr
                  key={prod.id}
                  tabIndex={0}
                  onClick={() => onSelect && onSelect(prod.id)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onSelect && onSelect(prod.id))}
                  style={{
                    background: 'transparent',
                    borderRadius: 10,
                    borderBottom: '1px solid #333',
                    transition: 'border 0.15s',
                    cursor: 'pointer',
                    outline: seleccionado ? '2.5px solid #ffd203' : 'none',
                    border: seleccionado ? '2.5px solid #ffd203' : '2.5px solid transparent'
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '6px' }}>
                    <img
                      src={prod.image_url || placeholderImage}
                      alt={prod.name}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, background: '#333' }}
                    />
                  </td>
                  <td style={{ color: '#ffd203', fontWeight: 700, fontSize: 15, padding: '6px', textAlign: 'left', maxWidth: 120 }}>
                    <span style={seleccionado ? {
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      display: 'block',
                    } : {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      maxWidth: 120
                    }}>
                      {prod.name}
                    </span>
                  </td>
                  <td style={{ color: '#fffbe7', fontWeight: 700, fontSize: 15, padding: '6px', textAlign: 'center' }}>S/ {Number(prod.price || 0).toFixed(2)}</td>
                  <td style={{ textAlign: 'center', padding: '6px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); onAgregar(prod); }}
                      style={{
                        background: seleccionado ? '#ffd203' : '#232323',
                        color: seleccionado ? '#010001' : '#ffd203',
                        border: '2px solid #ffd203',
                        borderRadius: 8,
                        padding: '0.3rem 0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductosGrid;
