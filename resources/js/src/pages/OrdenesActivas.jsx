import React, { useEffect, useState } from 'react';
import echo from '../echo';
import ModalOrdenDetalle from '../components/ModalOrdenDetalle';
import PedidoItemsList from '../components/pedidos/PedidoItemsList';
import styles from '../components/pedidos/NuevoPedido.module.css';
import { listarImpresoras, vistaPreviaTicketVenta, printTicketVenta } from '../helpers/printTicket';
import ModalVistaPreviaTicket from '../components/ModalVistaPreviaTicket';
import axios from '../axiosConfig';


function OrdenesActivas() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarHistoricos, setMostrarHistoricos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenDetalle, setOrdenDetalle] = useState(null);
  const [expandida, setExpandida] = useState(null); // id de la orden expandida
  // Modal de vista previa ticket/comanda
  const [modalVistaPreviaOpen, setModalVistaPreviaOpen] = useState(false);
  const [modalVistaPreviaData, setModalVistaPreviaData] = useState(null);
  const [modalVistaPreviaTipo, setModalVistaPreviaTipo] = useState('ticket');

  // Obtener usuario actual
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/orders');
        let data = Array.isArray(res.data) ? res.data : [];
        if (mostrarHistoricos) {
          data = data.filter(o => o.status !== 'activo');
        } else {
          data = data.filter(o => o.status === 'activo');
        }
        setOrdenes(data);
      } catch (err) {
        setError('Error al cargar las órdenes');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();

    // Suscripción realtime para órdenes activas (actualización de lista)
    const channel = echo.channel('orders')
      .listen('OrderActualizada', (e) => {
        setOrdenes(prevOrdenes => {
          const idx = prevOrdenes.findIndex(o => o.id === e.order.id);
          if (idx !== -1) {
            const nuevaLista = [...prevOrdenes];
            nuevaLista[idx] = e.order;
            return nuevaLista;
          } else {
            return [e.order, ...prevOrdenes];
          }
        });
        setTimeout(fetchOrdenes, 500);
      });

    // Suscripción SOLO para cocina: impresión automática
    let channelCocina;
    if (usuario && usuario.role === 'cocina') {
      channelCocina = echo.channel('impresion-cocina')
        .listen('ComandaParaImprimir', async (e) => {
          try {
            let printData = e.printData.pedido || e.printData;
            if (printData.tipo && !printData.type) {
              printData = { ...printData, type: printData.tipo };
            }
            window.vistaPreviaTicket(printData, 'comanda'); // SOLO para cocina: sigue usando la función de comanda
            await window.printTicket(printData, 'comanda');
          } catch (err) {
            alert('No se pudo imprimir la comanda automáticamente.');
          }
        });
    }
    return () => {
      channel.stopListening('OrderActualizada');
      if (channelCocina) channelCocina.stopListening('ComandaParaImprimir');
    };
  }, [mostrarHistoricos]);

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '24px',
      boxSizing: 'border-box',
      minHeight: 0,
      overflow: 'hidden'
    }}>
      <div style={{ flexShrink: 0, marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button onClick={listarImpresoras} style={{ background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>Ver impresoras disponibles</button>
          <button onClick={() => {
            // Ejemplo de datos de prueba para la vista previa
            const ejemplo = {
              mesa: '1',
              usuario: { name: 'Admin' },
              fecha: new Date().toLocaleString(),
              productos: [
                { cantidad: 2, nombre: 'Parrilla', subtotal: 120 },
                { cantidad: 1, nombre: 'Bebida', subtotal: 20, nota: 'Sin hielo' }
              ],
              total: 140
            };
            setModalVistaPreviaData(ejemplo);
            setModalVistaPreviaTipo('ticket');
            setModalVistaPreviaOpen(true);
          }} style={{ background: '#232323', color: '#ffd203', fontWeight: 700, border: '2px solid #ffd203', borderRadius: 8, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>
            Vista previa ticket
          </button>
        </div>
      </div>
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '100%'
      }}>
        <h2 className={styles.titulo} style={{ textAlign: 'center' }}>Órdenes {mostrarHistoricos ? 'Históricas' : 'Activas'}</h2>
        <button
          style={{ marginBottom: 18, background: '#232323', color: '#ffd203', border: '2px solid #ffd203', borderRadius: 8, padding: '0.4rem 1.1rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'center' }}
          onClick={() => setMostrarHistoricos(h => !h)}
        >
          {mostrarHistoricos ? 'Ver solo activas' : 'Ver históricos'}
        </button>
        <div style={{ 
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          width: '100%',
          display: 'flex', 
          flexDirection: 'column', 
          gap: 18, 
          alignItems: 'center'
        }}>
          {loading ? (
            <div style={{ color: '#ffd203', fontWeight: 700, fontSize: '1.2rem', marginTop: 32 }}>Cargando órdenes...</div>
          ) : error ? (
            <div style={{ color: 'red', fontWeight: 700, fontSize: '1.2rem', marginTop: 32 }}>{error}</div>
          ) : ordenes.length === 0 ? (
            <div style={{ color: '#ffd203', fontWeight: 700, fontSize: '1.2rem', marginTop: 32 }}>
              No hay órdenes activas.
            </div>
          ) : (
            ordenes.map(orden => {
                const esHistorico = orden.status !== 'activo';
                const expandidaEsta = expandida === orden.id;
                return (
                  <div
                    key={orden.id}
                    style={{
                      background: esHistorico ? '#353535' : '#232323',
                      border: esHistorico ? '2px solid #888' : '2px solid #ffd203',
                      borderRadius: 16,
                      padding: '0.7rem 1.1rem', // padding reducido
                      boxShadow: expandidaEsta 
                        ? '0 0 0 3px #ffd203' 
                        : esHistorico 
                        ? '0 2px 12px 0 rgba(100,100,100,0.10)' 
                        : '0 2px 12px 0 rgba(0,0,0,0.10)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      minWidth: 320,
                      maxWidth: 420,
                      width: 380,
                      // minHeight eliminado para que el alto sea solo el del contenido
                      opacity: esHistorico ? 0.7 : 1,
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                      justifyContent: 'flex-start',
                      alignItems: 'stretch',
                    }}
                    onClick={() => setExpandida(expandidaEsta ? null : orden.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 900, color: esHistorico ? '#aaa' : '#ffd203', fontSize: '1.1rem' }}>
                        Ticket #{orden.id} · {orden.type === 'mesa' ? 'Mesa' : orden.type === 'para_llevar' ? 'Para llevar' : 'Delivery'}
                        {orden.table_id ? ` · Mesa ${orden.table_id}` : ''}
                        {esHistorico && <span style={{ marginLeft: 8, color: '#ff4d4f', fontWeight: 700, fontSize: '0.95rem' }}>(Histórico)</span>}
                      </span>
                      <span style={{ color: '#fffbe7', fontWeight: 700, fontSize: '1rem' }}>{orden.created_at ? orden.created_at.substring(11,16) : ''}</span>
                    </div>
                    {orden.type === 'delivery' && (orden.client_name || orden.delivery_location) && (
                      <div style={{ color: '#ffd203', fontSize: '0.98rem', marginBottom: 2, fontWeight: 700 }}>
                        {orden.client_name && <span>Cliente: {orden.client_name}</span>}
                        {orden.client_name && orden.delivery_location && <span> · </span>}
                        {orden.delivery_location && <span>Ubicación: {orden.delivery_location}</span>}
                      </div>
                    )}
                    <div style={{ color: esHistorico ? '#aaa' : '#ffd203', fontWeight: 700, fontSize: '1rem' }}>
                      Atendido por: {orden.user && orden.user.name ? orden.user.name : '-'}
                    </div>
                    {expandidaEsta && (
                      <>
                        <div style={{ color: '#fffbe7', fontSize: '0.98rem', marginBottom: 2 }}>
                          {orden.items && orden.items.length > 0 ? (
                            orden.items.map((p, i) => (
                              <span key={i} style={{ marginRight: 12 }}>
                                {p.quantity} x {p.product?.name || `Producto #${p.product_id}`}
                              </span>
                            ))
                          ) : (
                            <span>Sin productos</span>
                          )}
                        </div>
                        <div style={{ color: '#ffd203', fontWeight: 700, fontSize: '1.1rem', marginTop: 4 }}>
                          Total: S/{typeof orden.total === 'number' ? orden.total.toFixed(2) : (orden.total && !isNaN(Number(orden.total))) ? Number(orden.total).toFixed(2) : '-'}
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                          {!esHistorico && (
                            <button
                              style={{ background: '#ffd203', color: '#010001', border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', fontWeight: 800, cursor: 'pointer' }}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('¿Seguro que deseas cancelar esta orden?')) {
                                  try {
                                    await axios.delete(`/api/orders/${orden.id}`);
                                    setOrdenes(prev => prev.filter(o => o.id !== orden.id));
                                  } catch {
                                    alert('No se pudo cancelar la orden.');
                                  }
                                }
                              }}
                            >Cancelar</button>
                          )}
                          {!esHistorico && (
                            <button
                              style={{ background: '#232323', color: '#ffd203', border: '2px solid #ffd203', borderRadius: 8, padding: '0.5rem 1.1rem', fontWeight: 800, cursor: 'pointer' }}
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const res = await axios.get(`/api/orders/${orden.id}/print-data`);
                                  let printData = res.data.pedido || res.data;
                                  if (printData.tipo && !printData.type) {
                                    printData = { ...printData, type: printData.tipo };
                                  }
                                  // Mostrar vista previa antes de imprimir
                                  vistaPreviaTicketVenta(printData);
                                  await printTicketVenta(printData);
                                } catch (err) {
                                  alert('No se pudo imprimir el ticket.');
                                }
                              }}
                            >Imprimir</button>
                          )}
                          <button
                            style={{ background: '#232323', color: '#ffd203', border: '2px solid #ffd203', borderRadius: 8, padding: '0.5rem 1.1rem', fontWeight: 800, cursor: 'pointer' }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const res = await axios.get(`/api/orders/${orden.id}/print-data`);
                                let printData = res.data.pedido || res.data;
                                if (printData.tipo && !printData.type) {
                                  printData = { ...printData, type: printData.tipo };
                                }
                                // Usar vista previa de ticket de venta tradicional
                                // DEBUG: Forzar log para ver qué función se está llamando y cómo llegan los datos
                                console.log('DEBUG vistaPreviaTicketVenta', printData);
                                vistaPreviaTicketVenta(printData);
                              } catch (err) {
                                alert('No se pudo mostrar la vista previa.');
                              }
                            }}
                          >Vista previa</button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
        </div>
      </div>
    
      <ModalOrdenDetalle open={modalOpen} onClose={() => setModalOpen(false)}>
        {ordenDetalle && (
          <>
            <h3 style={{ color: '#ffd203', marginBottom: 10 }}>
              Orden #{ordenDetalle.id}
              {ordenDetalle.mesa ? ` - Mesa ${ordenDetalle.mesa}` : ''}
            </h3>
            {ordenDetalle.type === 'delivery' && (ordenDetalle.client_name || ordenDetalle.delivery_location) && (
              <div style={{ color: '#ffd203', fontSize: '1rem', marginBottom: 8, fontWeight: 700 }}>
                {ordenDetalle.client_name && <span>Cliente: {ordenDetalle.client_name}</span>}
                {ordenDetalle.client_name && ordenDetalle.delivery_location && <span> · </span>}
                {ordenDetalle.delivery_location && <span>Ubicación: {ordenDetalle.delivery_location}</span>}
              </div>
            )}
            <div style={{ marginBottom: 10 }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Estado: </span>
              <span style={{ color: '#ffd203', fontWeight: 700 }}>{ordenDetalle.estado}</span>
            </div>
            <PedidoItemsList items={ordenDetalle.productos} quitarItem={() => {}} />
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginTop: 12 }}>
              Total: <span style={{ color: '#ffd203' }}>${ordenDetalle.total}</span>
            </div>
          </>
        )}
      </ModalOrdenDetalle>
      <ModalVistaPreviaTicket
        open={modalVistaPreviaOpen}
        onClose={() => setModalVistaPreviaOpen(false)}
        ticketData={modalVistaPreviaData}
        tipo={modalVistaPreviaTipo}
      />
    </div>
  );
}

export default OrdenesActivas;
