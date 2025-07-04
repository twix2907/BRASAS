import React from 'react';
import { printTicket, vistaPreviaTicket } from '../helpers/printTicket';

export function BotonPruebaImpresion() {
  const handleTestPrint = async () => {
    const data = {
      mesa: '1',
      usuario: 'Prueba',
      fecha: new Date().toLocaleString(),
      productos: [
        { nombre: 'Coca-Cola', cantidad: 2, subtotal: 30 },
        { nombre: 'Hamburguesa', cantidad: 1, subtotal: 50, nota: 'Sin cebolla' }
      ],
      total: 80
    };
    try {
      await printTicket(data, 'ticket', 'RAW');
      // Mostrar vista previa después de imprimir
      vistaPreviaTicket(data, 'ticket');
    } catch (e) {
      alert('Error al imprimir: ' + e.message);
    }
  };
  return (
    <button style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#ffd203', color: '#010001', fontWeight: 900, fontSize: 18, borderRadius: 12, padding: '1rem 2rem', border: 'none', boxShadow: '0 2px 12px #0008', cursor: 'pointer' }} onClick={handleTestPrint}>
      Imprimir ticket de prueba
    </button>
  );
}
