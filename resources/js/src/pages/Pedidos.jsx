import React, { useEffect, useState } from 'react';
import NuevoPedido from './NuevoPedido';
import { listarImpresoras, vistaPreviaTicket } from '../helpers/printTicket';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recargar, setRecargar] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/orders');
        if (!res.ok) throw new Error('Error en la respuesta');
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [recargar]);

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#ffd203' }}>Pedidos</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={listarImpresoras} style={{ background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>Ver impresoras disponibles</button>
        <button onClick={() => {
          // Ejemplo de datos de prueba para la vista previa
          const ejemplo = {
            mesa: '1',
            usuario: 'Admin',
            fecha: new Date().toLocaleString(),
            productos: [
              { cantidad: 2, nombre: 'Parrilla', subtotal: 120 },
              { cantidad: 1, nombre: 'Bebida', subtotal: 20, nota: 'Sin hielo' }
            ],
            total: 140
          };
          vistaPreviaTicket(ejemplo, 'ticket');
        }} style={{ background: '#232323', color: '#ffd203', fontWeight: 700, border: '2px solid #ffd203', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>
          Vista previa ticket
        </button>
      </div>
      <NuevoPedido onPedidoCreado={() => setRecargar(r => !r)} />
      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <table style={{ width: '100%', background: '#222', color: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#010001' }}>
              <th>ID</th>
              <th>Mesa</th>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.table_id || '-'}</td>
                <td>{pedido.user_id}</td>
                <td>{pedido.type}</td>
                <td>{pedido.status}</td>
                <td>{
                  typeof pedido.total === 'number'
                    ? `$${pedido.total.toFixed(2)}`
                    : (pedido.total && !isNaN(Number(pedido.total)))
                      ? `$${Number(pedido.total).toFixed(2)}`
                      : '-'
                }</td>
                <td>
                  <ul style={{ paddingLeft: 16 }}>
                    {pedido.items && pedido.items.length > 0 ? (
                      pedido.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity} x {item.product?.name || `Producto #${item.product_id}`} {item.notes && <span>({item.notes})</span>}
                        </li>
                      ))
                    ) : (
                      <li>Sin productos</li>
                    )}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Pedidos;
