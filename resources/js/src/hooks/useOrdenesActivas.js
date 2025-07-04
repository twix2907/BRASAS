import { useEffect, useState } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

// Hook para obtener órdenes activas (mock inicial, luego API real)
export function useOrdenesActivas() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para recargar órdenes activas
  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders?status=activo');
      const data = res.data;
      const activas = Array.isArray(data)
        ? data.filter(o => o.status === 'activo' && o.table_id)
        : [];
      setOrdenes(activas.map(o => ({ id: o.id, mesa_id: o.table_id })));
    } catch (e) {
      setError('No se pudieron cargar las órdenes activas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
    // Suscribirse a tiempo real
    const channel = echo.channel('orders')
      .listen('OrdenActualizada', fetchOrdenes);
    return () => {
      channel.stopListening('OrdenActualizada');
    };
    // eslint-disable-next-line
  }, []);

  return { ordenes, loading, error, fetchOrdenes };
}
