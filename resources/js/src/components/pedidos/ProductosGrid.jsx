import React from 'react';
import placeholderImage from '../../../public/placeholder_brasas.png';

// props: productos, filtro, onFiltroChange, onSelect, productoSeleccionado

const ProductosGrid = ({ productos, filtro, onFiltroChange, onSelect, productoSeleccionado, soloMatrizScrollable }) => {
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

      {/* Sección inferior: Matriz de productos (scrollable) */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
          padding: '4px'
        }}>
          {productosFiltrados.length === 0 && (
            <div style={{ gridColumn: '1/-1', color: '#ffd203', fontSize: 18, textAlign: 'center', marginTop: 24 }}>No hay productos</div>
          )}
          {productosFiltrados.map(prod => (
            <div
              key={prod.id}
              tabIndex={0}
              onClick={() => onSelect(prod.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(prod.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#181818',
                border: prod.id === Number(productoSeleccionado) ? '2.5px solid #fffbe7' : '2.5px solid transparent',
                borderRadius: 14, padding: '0.7rem 0.5rem 0.6rem 0.5rem', cursor: 'pointer',
                boxShadow: prod.id === Number(productoSeleccionado) ? '0 2px 12px 0 rgba(255,210,3,0.18)' : '0 1px 4px 0 rgba(0,0,0,0.10)',
                outline: 'none', minWidth: 0, minHeight: 0, transition: 'border 0.18s, box-shadow 0.18s',
              }}
            >
              <img
                src={prod.image_url || placeholderImage}
                alt={prod.name}
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, background: '#333', marginBottom: 8 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ color: '#ffd203', fontSize: 16, fontWeight: 700, textAlign: 'center', marginBottom: 2 }}>{prod.name}</span>
                <span style={{ color: '#fffbe7', fontSize: 15, fontWeight: 600 }}>S/ {Number(prod.price || 0).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductosGrid;
