import React, { useState, useMemo } from 'react';
import styles from './NuevoPedido.module.css';

function ProductoListaSelector({ productos, value, onChange, error, loading }) {
  const [busqueda, setBusqueda] = useState('');
  const activos = useMemo(() => productos.filter(p => p.active), [productos]);
  const filtrados = useMemo(() => {
    if (!busqueda.trim()) return activos;
    const b = busqueda.trim().toLowerCase();
    return activos.filter(p =>
      p.name.toLowerCase().includes(b) ||
      (p.category?.toLowerCase().includes(b) || '')
    );
  }, [activos, busqueda]);

  return (
    <div className={styles.productoListaSelector}>
      <label htmlFor="busqueda-producto" className={styles.labelBusqueda}>Buscar producto:</label>
      <input
        id="busqueda-producto"
        type="text"
        className={styles.inputBusqueda}
        placeholder="Buscar por nombre o categoría..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        autoComplete="off"
      />
      {loading ? (
        <div className={styles.productoMsg}>Cargando productos...</div>
      ) : error ? (
        <div className={styles.productoMsg} style={{ color: 'red' }}>{error}</div>
      ) : filtrados.length === 0 ? (
        <div className={styles.productoMsg}>No hay productos disponibles</div>
      ) : (
        <div className={styles.productoGrid}>
          {filtrados.map(p => (
            <button
              type="button"
              key={p.id}
              className={
                styles.productoCard +
                (value == p.id ? ' ' + styles.productoCardActivo : '')
              }
              onClick={() => onChange({ target: { value: p.id } })}
              tabIndex={0}
              aria-label={`Seleccionar ${p.name}`}
            >
              <img
                src={p.image_url ? p.image_url : '/logo_brasas.jpg'}
                alt={p.name}
                className={styles.productoImg}
                loading="lazy"
                style={{
                  filter: p.image_url ? 'none' : 'grayscale(1)',
                  opacity: p.image_url ? 1 : 0.7
                }}
              />
              <div className={styles.productoInfo}>
                <span className={styles.productoNombre}>{p.name}</span>
                <span className={styles.productoPrecio}>${p.price}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductoListaSelector;
