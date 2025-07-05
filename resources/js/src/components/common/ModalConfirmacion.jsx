import React from 'react';

const ModalConfirmacion = ({ 
  open, 
  onClose, 
  onConfirm, 
  loading = false,
  titulo = 'Confirmar acción',
  mensaje = '¿Estás seguro?',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  tipo = 'peligro' // 'peligro' | 'advertencia' | 'normal'
}) => {
  if (!open) return null;

  const colores = {
    peligro: {
      botonConfirmar: '#ff4444',
      bordeTitulo: '#ff4444',
      colorTitulo: '#ff4444'
    },
    advertencia: {
      botonConfirmar: '#ff9800',
      bordeTitulo: '#ff9800',
      colorTitulo: '#ff9800'
    },
    normal: {
      botonConfirmar: '#ffd203',
      bordeTitulo: '#ffd203',
      colorTitulo: '#ffd203'
    }
  };

  const estilos = colores[tipo] || colores.normal;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: '#232323',
        borderRadius: 12,
        padding: 24,
        maxWidth: 400,
        width: '90%',
        border: `2px solid ${estilos.bordeTitulo}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{
          color: estilos.colorTitulo,
          margin: '0 0 16px 0',
          fontSize: '1.3rem',
          fontWeight: 700,
          textAlign: 'center'
        }}>
          {titulo}
        </h3>
        
        <p style={{
          color: '#fff',
          margin: '0 0 24px 0',
          fontSize: '1rem',
          lineHeight: 1.5,
          textAlign: 'center'
        }}>
          {mensaje}
        </p>
        
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center'
        }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              color: '#ffd203',
              border: '1px solid #ffd203',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {textoCancelar}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              background: estilos.botonConfirmar,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Procesando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
