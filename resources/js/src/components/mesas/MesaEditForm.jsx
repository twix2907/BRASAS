import React from 'react';

const MesaEditForm = ({ editState, setEditState, onSave, onCancel }) => {
  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      marginBottom: 2,
      gap: 4
    }}>
      <input
        value={editState.nombre}
        onChange={(e) => setEditState(prev => ({ ...prev, nombre: e.target.value }))}
        style={{
          fontWeight: 900,
          fontSize: '1.1rem',
          borderRadius: 6,
          border: '1px solid #ffd203',
          padding: '2px 8px',
          width: '100%',
          maxWidth: 110,
          textAlign: 'center',
          background: '#232323',
          color: '#ffd203',
        }}
        disabled={editState.loading}
        placeholder="Nombre"
      />
      <input
        type="number"
        min={1}
        max={30}
        value={editState.personas}
        onChange={(e) => setEditState(prev => ({ ...prev, personas: Number(e.target.value) }))}
        style={{
          fontWeight: 900,
          fontSize: '1rem',
          borderRadius: 6,
          border: '1px solid #ffd203',
          padding: '2px 8px',
          width: '100%',
          maxWidth: 80,
          textAlign: 'center',
          background: '#232323',
          color: '#ffd203',
        }}
        disabled={editState.loading}
        placeholder="Personas"
      />
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={onSave}
          style={{
            background: '#ffd203',
            color: '#010001',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: 12,
          }}
          disabled={editState.loading}
        >
          ✔
        </button>
        <button
          onClick={onCancel}
          style={{
            background: '#232323',
            color: '#ffd203',
            border: '1px solid #ffd203',
            borderRadius: 6,
            fontWeight: 700,
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: 12,
          }}
          disabled={editState.loading}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default MesaEditForm;