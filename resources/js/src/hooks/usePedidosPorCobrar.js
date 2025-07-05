import { useEffect, useState, useCallback } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

// Hook para obtener pedidos por cobrar en tiempo real
export function usePedidosPorCobrar() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar pedidos por cobrar
  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/orders?status=por_cobrar');
      const data = res.data;
      const porCobrar = Array.isArray(data)
        ? data.filter(o => o.status === 'por_cobrar')
        : [];
      setPedidos(porCobrar);
    } catch (e) {
      setError('No se pudieron cargar los pedidos por cobrar');
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualiza solo un pedido en el estado local (por id)
  const updatePedidoLocal = useCallback(async (ordenActualizada) => {
    // Si no trae user, hacer fetch puntual
    let ordenCompleta = ordenActualizada;
    if (!ordenActualizada.user) {
      try {
        const res = await axios.get(`/api/orders/${ordenActualizada.id}`);
        ordenCompleta = res.data;
      } catch (e) {
        // Si falla, usa la orden recibida
      }
    }
    setPedidos(prev => {
      const idx = prev.findIndex(p => p.id === ordenCompleta.id);
      // Si la orden ya no es por cobrar, la quitamos del array
      if (ordenCompleta.status !== 'por_cobrar') {
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
        nuevas[idx] = ordenCompleta;
        return nuevas;
      } else {
        return [...prev, ordenCompleta];
      }
    });
  }, []);

  useEffect(() => {
    fetchPedidos();
    const channel = echo.channel('orders')
      .listen('OrderActualizada', (e) => {
        const orden = e && e.order ? e.order : e;
        if (orden && orden.id) {
          updatePedidoLocal(orden);
        }
      });
    return () => {
      channel.stopListening('OrderActualizada');
    };
  }, [fetchPedidos, updatePedidoLocal]);

  return { pedidos, loading, error, fetchPedidos };
}