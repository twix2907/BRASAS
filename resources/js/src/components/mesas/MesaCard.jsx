import React from 'react';
import { Link } from 'react-router-dom';
import { FaTable } from 'react-icons/fa6';
import MesaEditForm from './MesaEditForm';
import { getMesaCardStyles } from '../../utils/mesaCardStyles';

const MesaCard = ({
  mesa,
  ordenActiva,
  isEditing,
  editState,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onToggleStatus,
  onOcupacionChange,
  onOpenDetail,
  setEditState,
}) => {
  const ocupada = !!ordenActiva;
  const styles = getMesaCardStyles(mesa.active, ocupada);

  const handleCardClick = async (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'A') return;
    if (ocupada && mesa.active) {
      onOpenDetail(ordenActiva, mesa);
    }
  };

  return (
    <div
      style={styles.card}
      title={ocupada ? 'Ocupada: hay una orden activa' : 'Libre'}
      onClick={handleCardClick}
    >
      <div style={styles.header}>
        <FaTable size={38} style={styles.icon} />
        
        {isEditing ? (
          <MesaEditForm
            editState={editState}
            setEditState={setEditState}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <div style={styles.nameContainer}>
            <span style={styles.name}>{mesa.name}</span>
            <span style={{ fontSize: '0.8rem', color: '#aaa', marginLeft: 4 }}>
              ({Number(mesa.personas) || 1}p)
            </span>
            {mesa.active && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(mesa);
                }}
                style={styles.editButton}
                title="Editar mesa"
              >
                ✎
              </button>
            )}
          </div>
        )}
      </div>

      <div style={styles.status}>
        {!mesa.active ? 'Inhabilitada' : ocupada ? 'Ocupada' : 'Libre'}
      </div>

      {ocupada && (
        <span style={styles.activeOrder}>● Orden activa</span>
      )}

      {!ocupada && mesa.active ? (
        <Link
          to={`/pedidos?mesa=${mesa.id}`}
          style={styles.createOrderButton}
          onClick={(e) => e.stopPropagation()}
        >
          Crear orden
        </Link>
      ) : (
        <button
          style={styles.disabledButton}
          disabled
          onClick={(e) => e.stopPropagation()}
        >
          Crear orden
        </button>
      )}

      <button
        style={styles.occupancyButton(mesa.active)}
        disabled={!mesa.active}
        onClick={(e) => {
          e.stopPropagation();
          if (mesa.active) {
            onOcupacionChange(mesa, ordenActiva);
          }
        }}
      >
        {ocupada ? 'Marcar libre' : 'Marcar ocupada'}
      </button>

      <button
        style={styles.toggleButton(mesa.active)}
        disabled={editState.loading}
        onClick={(e) => {
          e.stopPropagation();
          onToggleStatus(mesa);
        }}
      >
        {editState.loading ? '...' : mesa.active ? 'Inhabilitar' : 'Reactivar'}
      </button>
    </div>
  );
};

export default MesaCard;