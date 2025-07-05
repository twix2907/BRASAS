import { useEffect } from 'react';
import echo from '../echo';

export const useRealtimeEvents = (refetch, fetchOrdenes) => {
  useEffect(() => {
    const channel = echo.channel('mesas').listen('MesaActualizada', (event) => {
      console.log('Evento MesaActualizada recibido', event);
      refetch();
      if (typeof fetchOrdenes === 'function') {
        fetchOrdenes();
      }
    });

    return () => {
      channel.stopListening('MesaActualizada');
    };
  }, [refetch, fetchOrdenes]);
};