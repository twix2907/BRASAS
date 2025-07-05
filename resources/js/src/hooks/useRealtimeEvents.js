import { useEffect } from 'react';
import echo from '../echo';

// Recibe updateMesaLocal y addMesaLocal para actualizar/agregar mesas en tiempo real
// Recibe updateMesaLocal y addMesaLocal para actualizar/agregar mesas en tiempo real
// Ahora recibe también el array de mesas para evitar duplicados
import { useCallback } from 'react';
export const useRealtimeEvents = (updateMesaLocal, fetchOrdenes, addMesaLocal, mesas=[]) => {
  useEffect(() => {
    const channel = echo.channel('mesas').listen('MesaActualizada', (event) => {
      console.log('Evento MesaActualizada recibido', event);
      if (event && event.mesa) {
        if (typeof updateMesaLocal === 'function') {
          updateMesaLocal(event.mesa);
        }
        // Solo agregar si NO existe ya la mesa (por id) ni hay una mesa temporal con mismo nombre y personas
        if (typeof addMesaLocal === 'function' && Array.isArray(mesas)) {
          const exists = mesas.some(m => m.id === event.mesa.id);
          // Detectar mesa temporal (id negativo) con mismo nombre y personas
          const tempIdx = mesas.findIndex(m => m.id < 0 && m.name === event.mesa.name && m.personas === event.mesa.personas);
          if (tempIdx !== -1) {
            // Reemplazar la mesa temporal por la real
            const nuevas = [...mesas];
            nuevas[tempIdx] = event.mesa;
            // setMesas no está disponible aquí, así que usamos updateMesaLocal para forzar el reemplazo
            if (typeof updateMesaLocal === 'function') {
              updateMesaLocal(event.mesa);
            }
          } else if (!exists) {
            addMesaLocal(event.mesa);
          }
        }
      }
      if (typeof fetchOrdenes === 'function') {
        fetchOrdenes();
      }
    });

    return () => {
      channel.stopListening('MesaActualizada');
    };
  }, [updateMesaLocal, addMesaLocal, fetchOrdenes, mesas]);
};