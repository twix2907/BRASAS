import { useEffect, useState, useCallback } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

export function useMesas() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para recargar mesas desde backend
  const refetch = useCallback(() => {
    setLoading(true);
    setError('');
    axios.get('/api/mesas')
      .then(res => setMesas(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Error al cargar las mesas.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
    // Suscribirse a tiempo real
    const channel = echo.channel('mesas')
      .listen('MesaActualizada', refetch);
    return () => {
      channel.stopListening('MesaActualizada');
    };
  }, [refetch]);

  return { mesas, loading, error, refetch };
}
