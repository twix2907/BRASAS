import React, { useRef, useState, useEffect } from 'react';
import mesaImg from '../../assets/mesas/mesa.svg';
import MesaEditForm from './MesaEditForm';

const MesaCard = ({
  mesa,
  ordenActiva,
  onOpenDetail,
  onEdit,
  onToggleStatus,
  onOcupacionChange,
  onDelete,
  isEditing,
  editState,
  onSaveEdit,
  onCancelEdit,
  setEditState,
  esAdmin = false,
}) => {
  const ocupada = !!ordenActiva;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Maneja el clic en la tarjeta
  const handleCardClick = (e) => {
    if (e.target.closest('.mesa-menu-btn')) return;
    if (ocupada && mesa.active) {
      onOpenDetail(ordenActiva, mesa);
    }
  };

  // Opciones del menú
  const handleEdit = () => { setMenuOpen(false); onEdit(mesa); };
  const handleToggleStatus = () => { setMenuOpen(false); onToggleStatus(mesa); };
  const handleOcupacion = () => { setMenuOpen(false); onOcupacionChange(mesa, ordenActiva); };
  const handleDelete = () => { setMenuOpen(false); onDelete(mesa); };

  // Color de tarjeta original (sin cambio por cantidad de personas)
  const cardStyle = {
    background: !mesa.active ? '#444' : ocupada ? '#3a1818' : '#232323',
    color: !mesa.active ? '#aaa' : ocupada ? '#ff4d4f' : '#ffd203',
    border: ocupada ? '2.5px solid #ff4d4f' : '2px solid #ffd203',
    borderRadius: 18,
    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
    opacity: mesa.active ? 1 : 0.6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    minHeight: 200,
    padding: '0 12px',
    position: 'relative',
    margin: 8,
    cursor: ocupada && mesa.active ? 'pointer' : 'default',
    transition: 'all 0.2s',
  };
  const menuBtnStyle = {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'none',
    border: 'none',
    color: '#ffd203',
    fontSize: 22,
    cursor: 'pointer',
    zIndex: 2,
    padding: 2,
    borderRadius: 6,
    outline: 'none',
  };
  const menuStyle = {
    position: 'absolute',
    top: 38,
    right: 10,
    background: '#232323',
    border: '1.5px solid #ffd203',
    borderRadius: 10,
    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.13)',
    zIndex: 10,
    minWidth: 150,
    padding: 0,
    overflow: 'hidden',
  };
  const menuItemStyle = {
    padding: '10px 18px',
    color: '#ffd203',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background 0.15s',
  };

  if (isEditing) {
    return (
      <div style={{ ...cardStyle, justifyContent: 'center', alignItems: 'center', minHeight: 200, padding: '0 12px' }}>
        <MesaEditForm
          editState={editState}
          setEditState={setEditState}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  return (
    <div style={cardStyle} title={ocupada ? 'Ocupada: hay una orden activa' : 'Libre'} onClick={handleCardClick}>
      {/* Botón de menú (3 puntitos) */}
      <button
        className="mesa-menu-btn"
        style={menuBtnStyle}
        onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
        aria-label="Opciones de mesa"
      >
        &#8942;
      </button>
      {menuOpen && (
        <div ref={menuRef} style={menuStyle} onClick={e => e.stopPropagation()}>
          <button style={menuItemStyle} onClick={e => { e.stopPropagation(); handleEdit(); }}>Editar</button>
          {mesa.active && (
            <button style={menuItemStyle} onClick={e => { e.stopPropagation(); handleOcupacion(); }}>{ocupada ? 'Marcar libre' : 'Marcar ocupada'}</button>
          )}
          <button style={menuItemStyle} onClick={e => { e.stopPropagation(); handleToggleStatus(); }}>{mesa.active ? 'Inhabilitar' : 'Reactivar'}</button>
          {esAdmin && (
            <button 
              style={{
                ...menuItemStyle,
                color: '#ff4444',
                borderTop: '1px solid #333'
              }} 
              onClick={e => { e.stopPropagation(); handleDelete(); }}
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      )}
      {/* Cantidad de personas en la esquina superior izquierda */}
      <span style={{
        position: 'absolute',
        top: 10,
        left: 12,
        background: 'rgba(30,30,30,0.85)',
        color: '#ffd203',
        fontWeight: 800,
        fontSize: 13,
        borderRadius: 8,
        padding: '2px 10px',
        zIndex: 2,
        minWidth: 28,
        textAlign: 'center',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)'
      }}>
        {Number(mesa.personas) || 1}p
      </span>
      {/* Icono SVG de mesa */}
      {/* Icono SVG de mesa con color dinámico de relleno y borde */}
      <svg
        width={60}
        height={60}
        viewBox="0 0 26 26"
        style={{ margin: '24px 0 8px 0', opacity: mesa.active ? 1 : 0.5, filter: mesa.active ? '' : 'grayscale(1)' }}
        aria-label="Mesa"
      >
        <g>
          <path
            d="M25.484,7.114l-4.278-3.917C21.034,3.069,20.825,3,20.61,3H5.38C5.165,3,4.956,3.069,4.783,3.197l-4.38,4C0.403,7.197,0,7.453,0,8v2c0,0.551,0.449,1,1,1h24c0.551,0,1-0.449,1-1V8C26,7.469,25.484,7.114,25.484,7.114z"
            fill={Number(mesa.personas) < 3 ? '#00bfff' : '#ffd203'}
            stroke={Number(mesa.personas) < 3 ? '#0077b6' : '#bfa600'}
            strokeWidth={0.7}
          />
          <path
            d="M2,23c-0.551,0-1-0.449-1-1V10h3v12c0,0.551-0.449,1-1,1H2z"
            fill={Number(mesa.personas) < 3 ? '#00bfff' : '#ffd203'}
            stroke={Number(mesa.personas) < 3 ? '#0077b6' : '#bfa600'}
            strokeWidth={0.7}
          />
          <path
            d="M23,23c-0.551,0-1-0.449-1-1V10h3v12c0,0.551-0.449,1-1,1H23z"
            fill={Number(mesa.personas) < 3 ? '#00bfff' : '#ffd203'}
            stroke={Number(mesa.personas) < 3 ? '#0077b6' : '#bfa600'}
            strokeWidth={0.7}
          />
          <path
            d="M20,18c-0.551,0-1-0.449-1-1v-5h2v5C21,17.551,20.551,18,20,18L20,18z"
            fill={Number(mesa.personas) < 3 ? '#00bfff' : '#ffd203'}
            stroke={Number(mesa.personas) < 3 ? '#0077b6' : '#bfa600'}
            strokeWidth={0.7}
          />
          <path
            d="M6,18c-0.551,0-1-0.449-1-1v-5h2v5C7,17.551,6.551,18,6,18L6,18z"
            fill={Number(mesa.personas) < 3 ? '#00bfff' : '#ffd203'}
            stroke={Number(mesa.personas) < 3 ? '#0077b6' : '#bfa600'}
            strokeWidth={0.7}
          />
        </g>
      </svg>
      <span style={{ fontWeight: 900, fontSize: 18, color: '#ffd203', marginBottom: 2 }}>{mesa.name}</span>
      {/* <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 8 }}>{Number(mesa.personas) || 1}p</span> */}
      {/* Botón Crear pedido */}
      {!ocupada && mesa.active ? (
        <button
          style={{
            margin: '10px 0 0 0',
            background: '#ffd203',
            color: '#010001',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.1rem',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            opacity: 1,
            width: '90%',
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
          onClick={e => {
            e.stopPropagation();
            window.location.href = `/pedidos?mesa=${mesa.id}`;
          }}
        >
          Crear pedido
        </button>
      ) : null}
      <div style={{ fontSize: 13, color: ocupada ? '#ff4d4f' : '#fff', fontWeight: 700, marginBottom: 2 }}>
        {!mesa.active ? 'Inhabilitada' : ocupada ? 'Ocupada' : 'Libre'}
      </div>
      {ocupada && (
        <span style={{ fontSize: 13, color: '#ff4d4f', fontWeight: 700 }}>● Orden activa</span>
      )}
    </div>
  );
};

export default MesaCard;