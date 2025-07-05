import { useEffect, useState, useCallback } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

export function useMesas() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Recarga todas las mesas (solo para el primer load o forzar refresh)
  const refetch = useCallback(() => {
    setLoading(true);
    setError('');
    axios.get('/api/mesas')
      .then(res => setMesas(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Error al cargar las mesas.'))
      .finally(() => setLoading(false));
  }, []);

  // Actualiza solo una mesa en el estado local (por id)
  const updateMesaLocal = useCallback((mesaActualizada) => {
    setMesas(prev => {
      const idx = prev.findIndex(m => m.id === mesaActualizada.id);
      if (idx === -1) return prev;
      const nuevas = [...prev];
      nuevas[idx] = { ...prev[idx], ...mesaActualizada };
      return nuevas;
    });
  }, []);

  // Agrega una mesa localmente (optimista)
  const addMesaLocal = useCallback((mesaNueva) => {
    setMesas(prev => [...prev, mesaNueva]);
  }, []);

  // Elimina una mesa localmente (si aplica)
  const removeMesaLocal = useCallback((mesaId) => {
    setMesas(prev => prev.filter(m => m.id !== mesaId));
  }, []);

  useEffect(() => {
    refetch();
    // Suscribirse a tiempo real SOLO actualiza la mesa afectada
    const channel = echo.channel('mesas')
      .listen('MesaActualizada', (e) => {
        if (e && e.mesa) {
          updateMesaLocal(e.mesa);
        } else {
          refetch(); // fallback
        }
      });
    return () => {
      channel.stopListening('MesaActualizada');
    };
  }, [refetch, updateMesaLocal]);

  return {
    mesas,
    loading,
    error,
    refetch,
    updateMesaLocal,
    addMesaLocal,
    removeMesaLocal,
    setMesas, // por si se necesita manipulación avanzada
  };
}
