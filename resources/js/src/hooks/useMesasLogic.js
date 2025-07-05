import { useState, useCallback } from 'react';
import axios from '../axiosConfig';
import { validateMesaName, validatePersonas } from '../utils/mesasValidation';

// Recibe funciones optimistas del hook useMesas
export const useMesasLogic = (mesas, refetch, fetchOrdenes, showToast, updateMesaLocal, addMesaLocal) => {
  const [editState, setEditState] = useState({
    mesaId: null,
    nombre: '',
    personas: 0,
    loading: false
  });

  const createMesa = useCallback(async (nombre, personas) => {
    const validation = validateMesaName(nombre, mesas);
    if (!validation.isValid) {
      showToast(validation.error);
      return false;
    }

    const personasValidation = validatePersonas(personas);
    if (!personasValidation.isValid) {
      showToast(personasValidation.error);
      return false;
    }

    // Generar un id temporal negativo para la mesa optimista
    const tempId = Date.now() * -1;
    const mesaTemp = { id: tempId, name: nombre.trim(), personas, active: true };
    addMesaLocal(mesaTemp);
    try {
      const res = await axios.post('/api/mesas', { name: nombre.trim(), personas });
      // Reemplazar la mesa temporal por la real
      if (res.data && res.data.id) {
        updateMesaLocal({ ...mesaTemp, ...res.data });
      }
      showToast('Mesa creada exitosamente');
      return true;
    } catch (error) {
      showToast('Error al crear mesa');
      // Revertir mesa temporal
      updateMesaLocal({ ...mesaTemp, deleted: true });
      return false;
    }
  }, [mesas, showToast, addMesaLocal, updateMesaLocal]);

  const updateMesa = useCallback(async (mesaId, nombre, personas) => {
    const validation = validateMesaName(nombre, mesas, mesaId);
    if (!validation.isValid) {
      showToast(validation.error);
      return false;
    }

    const personasValidation = validatePersonas(personas);
    if (!personasValidation.isValid) {
      showToast(personasValidation.error);
      return false;
    }

    setEditState(prev => ({ ...prev, loading: true }));
    // Optimista: actualiza localmente
    updateMesaLocal({ id: mesaId, name: nombre.trim(), personas });
    try {
      await axios.put(`/api/mesas/${mesaId}`, { name: nombre.trim(), personas });
      showToast('Mesa actualizada exitosamente');
      setEditState({ mesaId: null, nombre: '', personas: 0, loading: false });
      return true;
    } catch (error) {
      showToast('Error al actualizar mesa');
      // Revertir (opcional: podrías volver a llamar a refetch o guardar el estado anterior)
      refetch();
      return false;
    } finally {
      setEditState(prev => ({ ...prev, loading: false }));
    }
  }, [mesas, showToast, updateMesaLocal, refetch]);

  const toggleMesaStatus = useCallback(async (mesa) => {
    setEditState(prev => ({ ...prev, loading: true }));
    // Optimista: actualiza localmente
    updateMesaLocal({ id: mesa.id, active: !mesa.active });
    try {
      await axios.put(`/api/mesas/${mesa.id}`, { active: !mesa.active });
      showToast(mesa.active ? 'Mesa inhabilitada' : 'Mesa reactivada');
    } catch (error) {
      showToast('Error al actualizar mesa');
      // Revertir
      refetch();
    } finally {
      setEditState(prev => ({ ...prev, loading: false }));
    }
  }, [showToast, updateMesaLocal, refetch]);

  const handleOcupacionChange = useCallback(async (mesa, ordenActiva) => {
    try {
      if (ordenActiva) {
        await axios.delete(`/api/orders/${ordenActiva.id}`);
        showToast('Orden cancelada y mesa marcada como libre');
      } else {
        showToast('Mesa marcada como ocupada');
      }
      refetch();
      if (typeof fetchOrdenes === 'function') {
        fetchOrdenes();
      }
    } catch (error) {
      console.error('Error changing ocupacion:', error);
      showToast('No se pudo actualizar el estado de la mesa');
    }
  }, [refetch, fetchOrdenes, showToast]);

  const startEdit = useCallback((mesa) => {
    setEditState({
      mesaId: mesa.id,
      nombre: mesa.name,
      personas: typeof mesa.personas === 'number' ? mesa.personas : 1,
      loading: false
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditState({ mesaId: null, nombre: '', personas: 0, loading: false });
  }, []);

  return {
    editState,
    setEditState,
    createMesa,
    updateMesa,
    toggleMesaStatus,
    handleOcupacionChange,
    startEdit,
    cancelEdit
  };
};