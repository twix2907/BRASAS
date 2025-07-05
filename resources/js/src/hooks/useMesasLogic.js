import { useState, useCallback } from 'react';
import axios from '../axiosConfig';
import { validateMesaName, validatePersonas } from '../utils/mesasValidation';

export const useMesasLogic = (mesas, refetch, fetchOrdenes, showToast) => {
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

    try {
      await axios.post('/api/mesas', { name: nombre.trim(), personas });
      showToast('Mesa creada exitosamente');
      refetch();
      return true;
    } catch (error) {
      console.error('Error creating mesa:', error);
      showToast('Error al crear mesa');
      return false;
    }
  }, [mesas, refetch, showToast]);

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
    try {
      await axios.put(`/api/mesas/${mesaId}`, { 
        name: nombre.trim(), 
        personas 
      });
      showToast('Mesa actualizada exitosamente');
      refetch();
      setEditState({ mesaId: null, nombre: '', personas: 0, loading: false });
      return true;
    } catch (error) {
      console.error('Error updating mesa:', error);
      showToast('Error al actualizar mesa');
      return false;
    } finally {
      setEditState(prev => ({ ...prev, loading: false }));
    }
  }, [mesas, refetch, showToast]);

  const toggleMesaStatus = useCallback(async (mesa) => {
    setEditState(prev => ({ ...prev, loading: true }));
    try {
      await axios.put(`/api/mesas/${mesa.id}`, { active: !mesa.active });
      showToast(mesa.active ? 'Mesa inhabilitada' : 'Mesa reactivada');
      refetch();
    } catch (error) {
      console.error('Error toggling mesa status:', error);
      showToast('Error al actualizar mesa');
    } finally {
      setEditState(prev => ({ ...prev, loading: false }));
    }
  }, [refetch, showToast]);

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