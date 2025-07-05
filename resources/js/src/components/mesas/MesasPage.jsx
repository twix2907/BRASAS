import React, { useState } from 'react';
import { useMesas } from '../../hooks/useMesas';
import { useOrdenesActivas } from '../../hooks/useOrdenesActivas';
import { useMesasLogic } from '../../hooks/useMesasLogic';
import { useRealtimeEvents } from '../../hooks/useRealtimeEvents';
import { useToast } from '../../hooks/useToast';
import { useOrderDetail } from '../../hooks/useOrderDetail';

import MesaForm from './MesaForm';
import MesaCard from './MesaCard';
import ModalOrdenDetalle from '../ModalOrdenDetalle';
import PedidoItemsList from '../pedidos/PedidoItemsList';
import { BotonPruebaImpresion } from '../BotonPruebaImpresion';
import Toast from '../common/Toast';

import { STYLES } from '../../constants/mesasStyles';

const MesasPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenDetalle, setOrdenDetalle] = useState(null);

  // Custom hooks
  const { mesas, loading, error, refetch } = useMesas();
  const { ordenes: ordenesActivas, fetchOrdenes } = useOrdenesActivas();
  const { toastMsg, showToast } = useToast();
  const { getOrderDetail } = useOrderDetail();

  const {
    editState,
    setEditState,
    createMesa,
    updateMesa,
    toggleMesaStatus,
    handleOcupacionChange,
    startEdit,
    cancelEdit,
  } = useMesasLogic(mesas, refetch, fetchOrdenes, showToast);

  // Eventos en tiempo real
  useRealtimeEvents(refetch, fetchOrdenes);

  const handleOpenDetail = async (ordenActiva, mesa) => {
    try {
      const detail = await getOrderDetail(ordenActiva.id);
      setOrdenDetalle({
        id: detail.id,
        mesa: mesa.name,
        productos: detail.items.map(item => ({
          name: item.product?.name || 'Producto',
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        })),
        total: detail.total,
        estado: detail.status || 'Activo',
      });
      setModalOpen(true);
    } catch (error) {
      console.error('Error loading order detail:', error);
      setOrdenDetalle({
        id: ordenActiva.id,
        mesa: mesa.name,
        productos: [],
        total: 0,
        estado: 'Error',
        error: 'No se pudo cargar el detalle de la orden.',
      });
      setModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    await updateMesa(editState.mesaId, editState.nombre, editState.personas);
  };

  if (loading) {
    return (
      <div style={STYLES.container}>
        <div style={STYLES.loadingContainer}>
          <p style={STYLES.loadingText}>Cargando mesas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={STYLES.container}>
      <BotonPruebaImpresion />
      <div style={STYLES.content}>
        <h2 style={STYLES.title}>Gestión de Mesas</h2>
        
        <MesaForm 
          onSubmit={createMesa} 
          isLoading={editState.loading} 
        />
        
        {error && (
          <p style={STYLES.errorText}>{error}</p>
        )}
        
        <div style={STYLES.mesasGrid}>
          {mesas.length === 0 ? (
            <div style={STYLES.emptyState}>
              No hay mesas registradas.
            </div>
          ) : (
            mesas.map((mesa) => {
              const ordenActiva = ordenesActivas.find(o => o.mesa_id === mesa.id);
              return (
                <MesaCard
                  key={mesa.id}
                  mesa={mesa}
                  ordenActiva={ordenActiva}
                  isEditing={editState.mesaId === mesa.id}
                  editState={editState}
                  onEdit={startEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={cancelEdit}
                  onToggleStatus={toggleMesaStatus}
                  onOcupacionChange={handleOcupacionChange}
                  onOpenDetail={handleOpenDetail}
                  setEditState={setEditState}
                />
              );
            })
          )}
        </div>

        <Toast message={toastMsg} />

        <ModalOrdenDetalle
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          {ordenDetalle && (
            <>
              <h3 style={{ color: '#ffd203', marginBottom: 10 }}>
                Orden #{ordenDetalle.id} - Mesa {ordenDetalle.mesa}
              </h3>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>Estado: </span>
                <span style={{ color: '#ffd203', fontWeight: 700 }}>
                  {ordenDetalle.estado}
                </span>
              </div>
              {ordenDetalle.error ? (
                <p style={{ color: '#ff4d4f' }}>{ordenDetalle.error}</p>
              ) : (
                <PedidoItemsList
                  items={ordenDetalle.productos}
                  quitarItem={() => {}}
                />
              )}
              <div style={{ 
                color: '#fff', 
                fontWeight: 700, 
                fontSize: 18, 
                marginTop: 12 
              }}>
                Total: <span style={{ color: '#ffd203' }}>${ordenDetalle.total}</span>
              </div>
            </>
          )}
        </ModalOrdenDetalle>
      </div>
    </div>
  );
};

export default MesasPage;