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
import ModalConfirmacion from '../common/ModalConfirmacion';
import { BotonPruebaImpresion } from '../BotonPruebaImpresion';
import Toast from '../common/Toast';

import { STYLES } from '../../constants/mesasStyles';

const MesasPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenDetalle, setOrdenDetalle] = useState(null);
  const [modalEliminar, setModalEliminar] = useState({ open: false, mesa: null, loading: false });

  // Obtener usuario actual para verificar permisos
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esAdmin = usuario.role === 'admin';
  const esMesero = usuario.role === 'mesero';

  // Custom hooks
  const { mesas, loading, error, refetch, updateMesaLocal, addMesaLocal, removeMesaLocal } = useMesas();
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
    deleteMesa,
  } = useMesasLogic(mesas, refetch, fetchOrdenes, showToast, updateMesaLocal, addMesaLocal, removeMesaLocal);

  // Eventos en tiempo real
  useRealtimeEvents(updateMesaLocal, fetchOrdenes, addMesaLocal, mesas);

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

  const handleDeleteMesa = (mesa) => {
    setModalEliminar({ open: true, mesa, loading: false });
  };

  const confirmarEliminar = async () => {
    setModalEliminar(prev => ({ ...prev, loading: true }));
    const exito = await deleteMesa(modalEliminar.mesa.id);
    if (exito) {
      setModalEliminar({ open: false, mesa: null, loading: false });
    } else {
      setModalEliminar(prev => ({ ...prev, loading: false }));
    }
  };

  const cancelarEliminar = () => {
    setModalEliminar({ open: false, mesa: null, loading: false });
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
      {/* <BotonPruebaImpresion /> */}
      <div style={STYLES.content}>
        <h2 style={STYLES.title}>Gestión de Mesas</h2>
        
        {/* Solo admin puede ver el formulario para agregar mesa */}
        {esAdmin && (
          <MesaForm 
            onSubmit={createMesa} 
            isLoading={editState.loading} 
          />
        )}
        
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
                  onEdit={esAdmin ? startEdit : undefined}
                  onSaveEdit={esAdmin ? handleSaveEdit : undefined}
                  onCancelEdit={esAdmin ? cancelEdit : undefined}
                  onToggleStatus={esAdmin ? toggleMesaStatus : undefined}
                  onOcupacionChange={esAdmin ? handleOcupacionChange : undefined}
                  onOpenDetail={handleOpenDetail}
                  onDelete={esAdmin ? handleDeleteMesa : undefined}
                  setEditState={esAdmin ? setEditState : undefined}
                  esAdmin={esAdmin}
                  esMesero={esMesero}
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
              {/* Botón Pedir cuenta solo si la orden está activa */}
              {ordenDetalle.estado === 'activo' && (
                <button
                  style={{
                    marginTop: 18,
                    background: '#ffd203',
                    color: '#010001',
                    fontWeight: 900,
                    border: 'none',
                    borderRadius: 10,
                    padding: '0.8rem 2.2rem',
                    fontSize: 18,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #0005',
                  }}
                  onClick={async () => {
                    try {
                      await import('../../axiosConfig').then(({ default: axios }) =>
                        axios.patch(`/api/orders/${ordenDetalle.id}`, { status: 'por_cobrar' })
                      );
                      setModalOpen(false);
                    } catch (err) {
                      alert('No se pudo marcar la orden como lista para cobrar.');
                    }
                  }}
                >
                  Pedir cuenta
                </button>
              )}
            </>
          )}
        </ModalOrdenDetalle>

        <ModalConfirmacion
          open={modalEliminar.open}
          onClose={cancelarEliminar}
          onConfirm={confirmarEliminar}
          titulo="Eliminar Mesa"
          mensaje={`¿Estás seguro de que deseas eliminar la mesa "${modalEliminar.mesa?.name}"?\n\nEsta acción no se puede deshacer y solo es posible si la mesa no tiene pedidos asociados.`}
          textoConfirmar="Eliminar"
          textoCancelar="Cancelar"
          loading={modalEliminar.loading}
          tipo="peligro"
        />
      </div>
    </div>
  );
};

export default MesasPage;