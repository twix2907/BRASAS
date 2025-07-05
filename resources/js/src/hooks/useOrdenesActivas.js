
import { useEffect, useState, useCallback } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

// Hook para obtener órdenes activas (mock inicial, luego API real)

// Hook para obtener y actualizar órdenes activas en tiempo real, eficiente (solo actualiza la orden afectada)
export function useOrdenesActivas() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Recarga todas las órdenes activas (solo para el primer load o forzar refresh)
  const fetchOrdenes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/orders?status=activo');
      const data = res.data;
      const activas = Array.isArray(data)
        ? data.filter(o => (o.status === 'activo' || o.status === 'por_cobrar') && o.table_id)
        : [];
      setOrdenes(activas.map(o => ({ id: o.id, mesa_id: o.table_id, status: o.status })));
    } catch (e) {
      setError('No se pudieron cargar las órdenes activas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualiza solo una orden en el estado local (por id)
  const updateOrdenLocal = useCallback((ordenActualizada) => {
    setOrdenes(prev => {
      const idx = prev.findIndex(o => o.id === ordenActualizada.id);
      // Si la orden ya no es activa, la quitamos del array
      if (ordenActualizada.status !== 'activo' && ordenActualizada.status !== 'por_cobrar') {
        if (idx !== -1) {
          const nuevas = [...prev];
          nuevas.splice(idx, 1);
          return nuevas;
        }
        return prev;
      }
      // Si existe, la actualizamos; si no, la agregamos
      if (idx !== -1) {
        const nuevas = [...prev];
        nuevas[idx] = {
          id: ordenActualizada.id,
          mesa_id: ordenActualizada.table_id,
          status: ordenActualizada.status,
        };
        return nuevas;
      } else {
        return [
          ...prev,
          {
            id: ordenActualizada.id,
            mesa_id: ordenActualizada.table_id,
            status: ordenActualizada.status,
          },
        ];
      }
    });
  }, []);

  useEffect(() => {
    fetchOrdenes();
    // Suscribirse a tiempo real SOLO actualiza la orden afectada
    const channel = echo.channel('orders')
      .listen('OrdenActualizada', (e) => {
        if (e && e.order) {
          updateOrdenLocal(e.order);
        } else {
          fetchOrdenes(); // fallback
        }
      });
    return () => {
      channel.stopListening('OrdenActualizada');
    };
  }, [fetchOrdenes, updateOrdenLocal]);

  return { ordenes, loading, error, fetchOrdenes };
}
