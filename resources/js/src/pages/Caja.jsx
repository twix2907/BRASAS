import React, { useState } from 'react';
import { usePedidosPorCobrar } from '../hooks/usePedidosPorCobrar';
import { printTicketVenta, vistaPreviaTicketVenta } from '../helpers/printTicket';

export default function Caja() {
    console.log('[Caja] Componente Caja montado');
  const [pedidoSel, setPedidoSel] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const { pedidos, loading, error } = usePedidosPorCobrar();

  // Filtro de búsqueda simple
  const pedidosFiltrados = pedidos.filter(p =>
    (p.table_id?.toString() || '').includes(busqueda) ||
    p.id.toString().includes(busqueda) ||
    (p.user?.name?.toLowerCase() || '').includes(busqueda.toLowerCase())
  );

  // Cobrar pedido (cambia a cerrado)
  const cobrarPedido = async (id) => {
    try {
      await import('../axiosConfig').then(({ default: axios }) =>
        axios.patch(`/api/orders/${id}`, { status: 'cerrado' })
      );
      setPedidoSel(null);
    } catch (e) {
      alert('No se pudo cobrar el pedido.');
    }
  };

  // Cancelar pedido
  const cancelarPedido = async (id) => {
    try {
      await import('../axiosConfig').then(({ default: axios }) =>
        axios.delete(`/api/orders/${id}`)
      );
      setPedidoSel(null);
    } catch (e) {
      alert('No se pudo cancelar el pedido.');
    }
  };

  // Imprimir ticket real
  const imprimirTicket = async (id) => {
    const win = window.open('', '_blank', 'width=400,height=600');
    if (win) {
      win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">Cargando ticket...</pre>');
      win.document.title = 'Vista previa ticket';
    }
    try {
      const { default: axios } = await import('../axiosConfig');
      const res = await axios.get(`/api/orders/${id}/print-data`);
      let printData = res.data.pedido || res.data;
      if (printData.tipo && !printData.type) {
        printData = { ...printData, type: printData.tipo };
      }
      // Normaliza productos para ticket de venta
      if (printData.items && !printData.productos) {
        printData.productos = printData.items.map(item => ({
          cantidad: item.cantidad ?? item.quantity ?? 0,
          nombre: item.nombre ?? item.name ?? (item.product ? item.product.name : ''),
          subtotal: typeof item.subtotal === 'number' ? item.subtotal : (item.price ?? 0) * (item.quantity ?? 0),
          nota: item.nota ?? item.notes ?? ''
        }));
      }
      vistaPreviaTicketVenta(printData, win);
      await printTicketVenta(printData, undefined, win);
    } catch (e) {
      if (win) {
        win.document.body.innerHTML = '';
        win.document.write('<pre style="font-size:16px;line-height:1.3;background:#222;color:#ffd203;padding:24px;">Error al imprimir o mostrar ticket.\n' + (e?.message || '') + '</pre>');
        win.document.title = 'Vista previa ticket';
      }
      alert('No se pudo imprimir el ticket.\n' + (e?.message || ''));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#010001', color: '#ffd203', fontFamily: 'Roboto, Nunito Sans, Arial', overflow: 'hidden' }}>
      {/* Lista de pedidos */}
      <div style={{ width: 380, background: '#232323', padding: 0, borderRight: '2px solid #ffd203', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 24, borderBottom: '2px solid #ffd203', background: '#232323' }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Pedidos por cobrar</h2>
          <input
            type="text"
            placeholder="Buscar mesa, pedido o usuario"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ width: '100%', marginTop: 12, padding: 8, borderRadius: 8, border: '1px solid #ffd203', fontSize: 16, background: '#181818', color: '#ffd203' }}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
          {loading && <div style={{ color: '#fffbe7', textAlign: 'center', marginTop: 40 }}>Cargando pedidos...</div>}
          {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>}
          {!loading && pedidosFiltrados.length === 0 && (
            <div style={{ color: '#fffbe7', textAlign: 'center', marginTop: 40 }}>No hay pedidos por cobrar</div>
          )}
          {pedidosFiltrados.map(p => (
            <div key={p.id} style={{ padding: 18, borderBottom: '1px solid #ffd203', cursor: 'pointer', background: pedidoSel && pedidoSel.id === p.id ? '#ffd20322' : 'none' }} onClick={() => setPedidoSel(p)}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Pedido #{p.id} {p.type !== 'mesa' && <span style={{ fontSize: 14, color: '#ffe066' }}>({p.type})</span>}</div>
              <div style={{ fontSize: 15, color: '#fffbe7' }}>Mesa: {p.table_id || '-'} | {p.user?.name || '-'}</div>
              <div style={{ fontSize: 14, color: '#ffe066' }}>Total: S/{p.total}</div>
              <div style={{ fontSize: 13, color: '#ffe066' }}>Hora: {p.created_at ? new Date(p.created_at).toLocaleTimeString() : '-'}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Detalle del pedido */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#010001', minWidth: 0 }}>
        {!pedidoSel ? (
          <div style={{ color: '#fffbe7', fontSize: 22, textAlign: 'center' }}>Selecciona un pedido para ver el detalle</div>
        ) : (
          <div style={{ background: '#232323', borderRadius: 18, boxShadow: '0 2px 16px #0008', padding: 36, minWidth: 380, maxWidth: 480, width: '100%', color: '#ffd203', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 900, fontSize: 26, marginBottom: 8 }}>Pedido #{pedidoSel.id}</h3>
            <div style={{ color: '#fffbe7', fontSize: 17, marginBottom: 8 }}>Mesa: {pedidoSel.table_id || '-'} | {pedidoSel.type}</div>
            <div style={{ color: '#fffbe7', fontSize: 15, marginBottom: 8 }}>Atiende: {pedidoSel.user?.name || '-'}</div>
            <div style={{ color: '#fffbe7', fontSize: 15, marginBottom: 8 }}>Hora: {pedidoSel.created_at ? new Date(pedidoSel.created_at).toLocaleTimeString() : '-'}</div>
            <div style={{ width: '100%', margin: '18px 0' }}>
              <table style={{ width: '100%', color: '#ffd203', fontSize: 16, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#ffe066' }}>
                    <th style={{ textAlign: 'left' }}>Producto</th>
                    <th>Cant</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoSel.items?.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.product?.name || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{prod.quantity}</td>
                      <td style={{ textAlign: 'right' }}>S/{prod.price * prod.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 18 }}>Total: S/{pedidoSel.total}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <button onClick={() => imprimirTicket(pedidoSel.id)} style={{ background: '#ffd203', color: '#010001', fontWeight: 800, border: 'none', borderRadius: 10, padding: '0.7rem 1.7rem', fontSize: 17, cursor: 'pointer' }}>Imprimir ticket</button>
              <button onClick={() => cobrarPedido(pedidoSel.id)} style={{ background: '#ffd203', color: '#010001', fontWeight: 800, border: 'none', borderRadius: 10, padding: '0.7rem 1.7rem', fontSize: 17, cursor: 'pointer' }}>Cobrar</button>
              <button onClick={() => cancelarPedido(pedidoSel.id)} style={{ background: '#232323', color: '#ffd203', fontWeight: 800, border: '2px solid #ffd203', borderRadius: 10, padding: '0.7rem 1.7rem', fontSize: 17, cursor: 'pointer' }}>Cancelar</button>
            </div>
            <button onClick={() => setPedidoSel(null)} style={{ marginTop: 24, background: 'none', color: '#ffe066', border: 'none', fontSize: 16, cursor: 'pointer' }}>Volver a lista</button>
          </div>
        )}
      </div>
      {/* Panel lateral: estado y usuario */}
      <div style={{ width: 220, background: '#232323', borderLeft: '2px solid #ffd203', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
        <div style={{ width: '100%', padding: 24, textAlign: 'center' }}>
          <img src="/logo_brasas.jpg" alt="Logo" style={{ width: 70, height: 70, borderRadius: '50%', marginBottom: 8 }} />
          <div style={{ fontWeight: 900, fontSize: 19, color: '#ffd203' }}>D'Brasas y Carbón</div>
          <div style={{ color: '#fffbe7', fontSize: 15, marginTop: 6 }}>Cajero: <b>María</b></div>
        </div>
        <div style={{ width: '100%', padding: 18, textAlign: 'center', borderTop: '2px solid #ffd203' }}>
          <div style={{ color: '#ffe066', fontSize: 15, marginBottom: 8 }}>Estado: <b>En línea</b></div>
          <button style={{ background: 'none', color: '#ffd203', border: '2px solid #ffd203', borderRadius: 10, padding: '0.5rem 1.2rem', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
