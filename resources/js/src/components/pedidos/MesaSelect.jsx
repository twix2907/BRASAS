import React from 'react';

function MesaSelect({ mesas, value, onChange, error, loading, selectClassName }) {
  const activas = mesas.filter(m => m.active === 1 || m.active === "1" || m.active === true);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <label htmlFor="mesa-select">Mesa:&nbsp;</label>
      {loading ? (
        <span style={{ color: '#ffd203', fontWeight: 600 }}>Cargando...</span>
      ) : error ? (
        <span style={{ color: 'red', fontWeight: 600 }}>{error}</span>
      ) : activas.length === 0 ? (
        <span style={{ color: '#ffd203', fontWeight: 600 }}>No hay mesas disponibles</span>
      ) : (
        <select
          id="mesa-select"
          value={value}
          onChange={onChange}
          required
          className={selectClassName}
          style={error ? { border: '2px solid #c00' } : {}}
        >
          <option value="">Selecciona una mesa</option>
          {activas.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default MesaSelect;
