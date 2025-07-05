import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { useOrdenesActivas } from '../hooks/useOrdenesActivas';
import { useMesas } from '../hooks/useMesas';
import { useProductos } from '../hooks/useProductos';
import MesaSelect from '../components/pedidos/MesaSelect';
import ProductoListaSelector from '../components/pedidos/ProductoListaSelector';
import CantidadNotas from '../components/pedidos/CantidadNotas';
import PedidoItemsList from '../components/pedidos/PedidoItemsList';
import styles from '../components/pedidos/NuevoPedido.module.css';
import { pedidoTexts } from './pedidoTexts';
import { printTicket } from '../helpers/printTicket';

function NuevoPedido({ onPedidoCreado }) {
  const location = useLocation();
  const { mesas, loading: loadingMesas, error: mesasError } = useMesas();
  const { productos, loading: loadingProductos, error: productosError } = useProductos();
  const { ordenes: ordenesActivas } = useOrdenesActivas();
  // Leer mesa de la query string si existe
  const getMesaFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('mesa') || '';
  };
  const [mesaId, setMesaId] = useState(getMesaFromQuery());

  // Si cambia la URL (ej: navegación interna), actualizar mesaId
  useEffect(() => {
    const mesaParam = getMesaFromQuery();
    if (mesaParam && mesaParam !== mesaId) setMesaId(mesaParam);
    // eslint-disable-next-line
  }, [location.search]);
  const [tipo, setTipo] = useState('mesa');
  const [items, setItems] = useState([]);
  const [clientName, setClientName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAgregado, setShowAgregado] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const notaMax = 200;

  const agregarItem = () => {
    if (!productoId || cantidad < 1 || cantidad === '' || !Number.isInteger(Number(cantidad))) return;
    const prod = productos.find(p => p.id === parseInt(productoId));
    if (!prod || !prod.active) return;
    const notaTrim = (nota || '').trim();
    const idx = items.findIndex(i => i.product_id === prod.id && (i.notes || '').trim() === notaTrim);
    if (idx !== -1) {
      const nuevos = [...items];
      nuevos[idx].quantity += Number(cantidad);
      setItems(nuevos);
    } else {
      setItems([
        ...items,
        {
          product_id: prod.id,
          name: prod.name,
          quantity: Number(cantidad),
          price: prod.price,
          notes: notaTrim
        }
      ]);
    }
    setCantidad(1);
    setNota('');
    setShowAgregado(true);
    setTimeout(() => {
      setShowAgregado(false);
      document.getElementById('cantidad-input')?.focus();
    }, 1200);
  };

  const quitarItem = idx => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Eliminado: duplicado y uso incorrecto de require
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (tipo === 'mesa' && !mesaId) {
      setError(pedidoTexts.mesaObligatoria);
      return;
    }
    if (items.length === 0) {
      setError(pedidoTexts.sinItems);
      return;
    }
    // Validación frontend: solo un pedido activo por mesa
    if (tipo === 'mesa' && ordenesActivas.some(o => String(o.mesa_id) === String(mesaId))) {
      setError('Ya existe un pedido activo para esta mesa. Solo puede haber un pedido activo por mesa.');
      return;
    }
    setLoading(true);
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const payload = {
        table_id: tipo === 'mesa' ? mesaId : null,
        user_id: usuario.id,
        type: tipo,
        items: items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
          notes: i.notes
        }))
      };
      if (tipo === 'delivery') {
        payload.client_name = clientName;
        payload.delivery_location = deliveryLocation;
      }
      const res = await axios.post('/api/orders', payload);

      setItems([]);
      setMesaId('');
      setTipo('mesa');
      setClientName('');
      setDeliveryLocation('');
      setSuccessMsg(pedidoTexts.pedidoExito);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setSuccessMsg('');
      }, 2200);
      if (onPedidoCreado) onPedidoCreado();
      // Obtener datos de impresión y llamar a printTicket
      try {
        const printRes = await axios.get(`/api/orders/${res.data.id}/print-data`);
        await printTicket(printRes.data.pedido, 'ticket');
      } catch (err) {
        alert('El pedido fue creado pero no se pudo imprimir el ticket automáticamente. Puede reintentarlo desde órdenes activas.');
      }
    } catch (err) {
      if (err.message.includes('Error')) {
        setError('Error de conexión al servidor');
      } else {
        setError(pedidoTexts.pedidoError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showToast && (
        <div className={styles.toastConfirm}>{successMsg || pedidoTexts.pedidoExito}</div>
      )}
      <div className={styles.formContainer}>
        <div className={styles.pedidoInner}>
          {/* Columna izquierda: productos */}
          <div className={styles.pedidoColProductos}>
            <h2 className={styles.titulo}>Nuevo Pedido</h2>
            <div className={styles.buscadorProductos}>
              <ProductoListaSelector
                productos={productos}
                value={productoId}
                onChange={e => setProductoId(e.target.value)}
                error={productosError}
                loading={loadingProductos}
              />
            </div>
          </div>
          {/* Columna derecha: opciones y acciones */}
          <div className={styles.pedidoColOpciones}>
            <form onSubmit={handleSubmit} autoComplete="off" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
              <div className={styles.pedidoOpcionesArriba}>
                <div className={styles.tipoMesaRow}>
                  <label htmlFor="tipo-select">{pedidoTexts.tipo}:&nbsp;</label>
                  <select
                    id="tipo-select"
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    className={styles.selectPedido}
                  >
                    <option value="mesa">Mesa</option>
                    <option value="para_llevar">Para llevar</option>
                    <option value="delivery">Delivery</option>
                  </select>
                  {tipo === 'mesa' && (
                    <MesaSelect
                      mesas={mesas}
                      value={mesaId}
                      onChange={e => setMesaId(e.target.value)}
                      error={mesasError || (error === pedidoTexts.mesaObligatoria ? error : '')}
                      loading={loadingMesas}
                      selectClassName={styles.selectPedido}
                    />
                  )}
                </div>
                {tipo === 'delivery' && (
                  <div style={{ margin: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ color: '#ffd203', fontWeight: 600 }} htmlFor="client-name">Nombre del cliente:</label>
                    <input
                      id="client-name"
                      type="text"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      required
                      placeholder="Nombre de quien recibe"
                      style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ffd203', fontSize: 16, background: '#181818', color: '#ffd203' }}
                    />
                    <label style={{ color: '#ffd203', fontWeight: 600 }} htmlFor="delivery-location">Ubicación para delivery:</label>
                    <input
                      id="delivery-location"
                      type="text"
                      value={deliveryLocation}
                      onChange={e => setDeliveryLocation(e.target.value)}
                      required
                      placeholder="Dirección o referencia"
                      style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ffd203', fontSize: 16, background: '#181818', color: '#ffd203' }}
                    />
                  </div>
                )}
                <div className={styles.cantidadNotasCol}>
                  <CantidadNotas cantidad={cantidad} setCantidad={setCantidad} nota={nota} setNota={setNota} notaMax={notaMax} />
                </div>
                <div className={styles.pedidoItemsList}>
                  <PedidoItemsList items={items} quitarItem={quitarItem} productos={productos} />
                </div>
                {/* El toast flotante ya muestra el mensaje de éxito */}
              </div>
              <div className={styles.pedidoOpcionesAbajo}>
                <button
                  type="button"
                  onClick={agregarItem}
                  style={{ background: (!productoId || cantidad < 1 || cantidad === '' || !Number.isInteger(Number(cantidad))) ? '#aaa' : '#ffd203', color: '#010001', border: 'none', borderRadius: 6, padding: '0.7rem 1.2rem', fontWeight: 700, cursor: (!productoId || cantidad < 1 || cantidad === '' || !Number.isInteger(Number(cantidad))) ? 'not-allowed' : 'pointer', opacity: (!productoId || cantidad < 1 || cantidad === '' || !Number.isInteger(Number(cantidad))) ? 0.7 : 1, fontSize: 18, width: '100%' }}
                  disabled={!productoId || cantidad < 1 || cantidad === '' || !Number.isInteger(Number(cantidad))}
                >
                  {pedidoTexts.agregar}
                </button>
                {showAgregado && (
                  <span style={{ color: '#4caf50', fontWeight: 600, transition: 'opacity 0.3s', fontSize: 16, marginTop: 4 }}>¡Producto agregado!</span>
                )}
                <button type="submit" disabled={loading || (tipo === 'mesa' && !mesaId) || items.length === 0} className={styles.botonConfirmar}>{pedidoTexts.confirmar}</button>
                {error && <div className={styles.errorMsg} style={{marginTop: 10}}>{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default NuevoPedido;
