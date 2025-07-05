
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
  isEditing,
  editState,
  onSaveEdit,
  onCancelEdit,
  setEditState,
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

  // Estilos básicos (puedes mover a un archivo aparte)
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
        <div ref={menuRef} style={menuStyle}>
          <button style={menuItemStyle} onClick={handleEdit}>Editar</button>
          {mesa.active && (
            <button style={menuItemStyle} onClick={handleOcupacion}>{ocupada ? 'Marcar libre' : 'Marcar ocupada'}</button>
          )}
          <button style={menuItemStyle} onClick={handleToggleStatus}>{mesa.active ? 'Inhabilitar' : 'Reactivar'}</button>
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
      <img src={mesaImg} width={60} height={60} alt="Mesa" style={{ margin: '24px 0 8px 0', filter: mesa.active ? '' : 'grayscale(1)', opacity: mesa.active ? 1 : 0.5 }} />
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