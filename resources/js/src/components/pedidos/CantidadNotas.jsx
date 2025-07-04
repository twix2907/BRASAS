
import React from 'react';
import styles from './NuevoPedido.module.css';

function CantidadNotas({ cantidad, setCantidad, nota, setNota, notaMax }) {
  return (
    <div className={styles.cantidadNotasCol}>
      <label htmlFor="cantidad-input" className={styles.cantidadNotasLabel}>Cantidad:</label>
      <input
        id="cantidad-input"
        type="number"
        min={1}
        step={1}
        value={cantidad}
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={e => {
          if (e.target.value === '' || e.target.value === undefined) {
            setCantidad('');
            return;
          }
          const val = Number(e.target.value);
          if (isNaN(val) || val < 1 || !Number.isInteger(val)) setCantidad('');
          else setCantidad(val);
        }}
        className={
          (cantidad < 1 || cantidad === '')
            ? `${styles.inputCantidad} ${styles.error}`
            : styles.inputCantidad
        }
        onBlur={() => { if (cantidad === '' || cantidad < 1) setCantidad(1); }}
        autoComplete="off"
      />
      <label htmlFor="nota-input" className={styles.cantidadNotasLabel}>Notas:</label>
      <input
        id="nota-input"
        type="text"
        placeholder="Notas (opcional)"
        value={nota}
        maxLength={notaMax}
        onChange={e => setNota(e.target.value)}
        className={styles.inputNota}
        autoComplete="off"
      />
      <span className={styles.cantidadNotasNotaLen}>{nota.length}/{notaMax}</span>
    </div>
  );
}

export default CantidadNotas;
