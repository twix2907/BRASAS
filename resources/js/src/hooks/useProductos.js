import { useEffect, useState } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchProductos = () => {
      axios.get('/api/productos')
        .then(res => setProductos(Array.isArray(res.data) ? res.data : []))
        .catch(() => setError('Error al cargar los productos.'))
        .finally(() => setLoading(false));
    };
    fetchProductos();
    // Suscribirse a tiempo real
    const channel = echo.channel('products')
      .listen('ProductActualizado', fetchProductos);
    return () => {
      channel.stopListening('ProductActualizado');
    };
  }, []);

  return { productos, loading, error };
}
