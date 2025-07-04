import { useState, useEffect, useCallback } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = useCallback(() => {
    setLoading(true);
    axios.get('/api/usuarios')
      .then(res => {
        setUsuarios(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar la lista de usuarios.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUsuarios();
    // Suscripción a eventos de usuarios (canal correcto y eventos con namespace)
    const channel = echo.channel('users');
    const handler = () => fetchUsuarios();
    channel.listen('.App\\Events\\UserActualizado', handler)
      .listen('.App\\Events\\UserCreado', handler)
      .listen('.App\\Events\\UserEliminado', handler)
      .listen('.App\\Events\\UserEstadoCambiado', handler)
      .listen('.App\\Events\\UserPinReseteado', handler)
      .listen('.App\\Events\\UserSesionCerrada', handler);
    return () => {
      channel.stopListening('.App\\Events\\UserActualizado')
        .stopListening('.App\\Events\\UserCreado')
        .stopListening('.App\\Events\\UserEliminado')
        .stopListening('.App\\Events\\UserEstadoCambiado')
        .stopListening('.App\\Events\\UserPinReseteado')
        .stopListening('.App\\Events\\UserSesionCerrada');
    };
  }, [fetchUsuarios]);

  return { usuarios, loading, error, refetch: fetchUsuarios };
}
