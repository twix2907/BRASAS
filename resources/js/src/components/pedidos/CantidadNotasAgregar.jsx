import React from 'react';

// props: cantidad, setCantidad, nota, setNota, onAgregar, productoSeleccionado, showAgregado
const CantidadNotasAgregar = ({ cantidad, setCantidad, nota, setNota, onAgregar, productoSeleccionado, showAgregado, ajustarBotones }) => {
  const notaMax = 200;
  const handleCantidad = dir => {
    if (dir === 'menos' && cantidad > 1) setCantidad(cantidad - 1);
    if (dir === 'mas') setCantidad(cantidad + 1);
  };
  return (
    <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => handleCantidad('menos')}
          disabled={cantidad <= 1}
          style={{
            fontSize: 28,
            background: '#232323',
            color: '#ffd203',
            border: '2.5px solid #ffd203',
            borderRadius: 10,
            width: 44,
            height: 44,
            cursor: cantidad <= 1 ? 'not-allowed' : 'pointer',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            marginRight: 6
          }}
        >
          <span style={{ display: 'block', lineHeight: 1, fontSize: 28, width: 24, textAlign: 'center' }}>-</span>
        </button>
        <input
          id="cantidad-input"
          type="number"
          min={1}
          value={cantidad}
          onChange={e => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
          style={{
            width: 60,
            textAlign: 'center',
            fontSize: 24,
            border: '2.5px solid #ffd203',
            borderRadius: 10,
            background: '#232323',
            color: '#ffd203',
            fontWeight: 700,
            padding: '0.5em 0.2em',
            margin: '0 6px',
            boxSizing: 'border-box',
            MozAppearance: 'textfield',
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          onWheel={e => e.target.blur()}
          onKeyDown={e => (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.preventDefault()}
        />
        <style>{`
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}</style>
        <button
          type="button"
          onClick={() => handleCantidad('mas')}
          style={{
            fontSize: 28,
            background: '#232323',
            color: '#ffd203',
            border: '2.5px solid #ffd203',
            borderRadius: 10,
            width: 44,
            height: 44,
            cursor: 'pointer',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            marginLeft: 6
          }}
        >
          <span style={{ display: 'block', lineHeight: 1, fontSize: 28, width: 24, textAlign: 'center' }}>+</span>
        </button>
      </div>
      <textarea
        value={nota}
        onChange={e => setNota(e.target.value.slice(0, notaMax))}
        placeholder="Notas para cocina (opcional)"
        rows={3}
        maxLength={notaMax}
        style={{ width: '100%', minHeight: 48, borderRadius: 10, border: '2.5px solid #ffd203', background: '#232323', color: '#ffd203', fontSize: 16, fontFamily: 'Nunito Sans, Roboto, Arial, sans-serif', padding: '0.7em 1em', resize: 'vertical' }}
      />
      <div style={{ alignSelf: 'flex-end', color: '#aaa', fontSize: 13 }}>{nota.length}/{notaMax}</div>
      <button
        type="button"
        onClick={onAgregar}
        disabled={!productoSeleccionado}
        style={{ background: !productoSeleccionado ? '#aaa' : '#ffd203', color: '#010001', border: 'none', borderRadius: 8, padding: '0.7rem 1.2rem', fontWeight: 700, cursor: !productoSeleccionado ? 'not-allowed' : 'pointer', opacity: !productoSeleccionado ? 0.7 : 1, fontSize: 18, width: '100%' }}
      >
        Agregar producto
      </button>
      {showAgregado && (
        <span style={{ color: '#4caf50', fontWeight: 600, transition: 'opacity 0.3s', fontSize: 16, marginTop: 4 }}>¡Producto agregado!</span>
      )}
    </div>
  );
};

export default CantidadNotasAgregar;
