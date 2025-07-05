import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { useOrdenesActivas } from '../hooks/useOrdenesActivas';
import { useMesas } from '../hooks/useMesas';
import { useProductos } from '../hooks/useProductos';

import ProductosGrid from '../components/pedidos/ProductosGrid';
import CantidadNotasAgregar from '../components/pedidos/CantidadNotasAgregar';
import PedidoTipoForm from '../components/pedidos/PedidoTipoForm';
import PedidoItemsListPedido from '../components/pedidos/PedidoItemsListPedido';
import ProductoDetalles from '../components/pedidos/ProductoDetalles';
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

  // Detectar rol de usuario para tipo inicial
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  const esCajero = usuario?.role === 'cajero';
  const esMesero = usuario?.role === 'mesero';
  // Si es cajero, tipo inicial debe ser 'para_llevar', si no, 'mesa'
  const tipoInicial = esCajero ? 'para_llevar' : 'mesa';
  const [tipo, setTipo] = useState(tipoInicial);

  // Si cambia la URL (ej: navegación interna), actualizar mesaId
  useEffect(() => {
    const mesaParam = getMesaFromQuery();
    if (mesaParam && mesaParam !== mesaId) setMesaId(mesaParam);
    // eslint-disable-next-line
  }, [location.search]);

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
      // Reiniciar tipo según rol
      if (esCajero) {
        setTipo('para_llevar');
      } else {
        setTipo('mesa');
      }
      setClientName('');
      setDeliveryLocation('');
      setSuccessMsg(pedidoTexts.pedidoExito);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setSuccessMsg('');
      }, 2200);
      if (onPedidoCreado) onPedidoCreado();
      // Ya no imprimir automáticamente la comanda aquí. Solo cocina imprime automáticamente.
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

  // Layout 3 columnas: productos | cantidad/notas/agregar | tipo de pedido + lista
  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#232323'
    }}>
      {showToast && (
        <div className={styles.toastConfirm}>{successMsg || pedidoTexts.pedidoExito}</div>
      )}
      
      {/* Contenedor principal de las 3 columnas */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.9fr 1.3fr',
        gap: 0,
        background: '#232323',
        alignItems: 'stretch',
        justifyItems: 'stretch',
        overflow: 'hidden',
      }}>
        {/* Columna 1: ProductosGrid */}
        <div style={{
          borderRight: '2px solid #181818',
          padding: '20px 16px 20px 20px',
          minWidth: 0,
          minHeight: 0,
          height: '100%',
          background: '#232323',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <ProductosGrid
            productos={productos}
            filtro={''}
            onFiltroChange={() => {}}
            onAgregar={prod => {
              // Agrega 1 unidad del producto seleccionado
              const idx = items.findIndex(i => i.product_id === prod.id && (i.notes || '').trim() === '');
              if (idx !== -1) {
                const nuevos = [...items];
                nuevos[idx].quantity += 1;
                setItems(nuevos);
              } else {
                setItems([
                  ...items,
                  {
                    product_id: prod.id,
                    name: prod.name,
                    quantity: 1,
                    price: prod.price,
                    notes: ''
                  }
                ]);
              }
              setShowAgregado(true);
              setTimeout(() => setShowAgregado(false), 1000);
            }}
            onSelect={setProductoId}
            productoSeleccionado={productoId}
            soloMatrizScrollable
          />
        </div>
        
        {/* Columna 2: CantidadNotasAgregar */}
        <div style={{
          padding: '20px 16px',
          minWidth: 0,
          minHeight: 0,
          height: '100%',
          background: '#232323',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowY: 'auto',
          boxSizing: 'border-box',
          maxWidth: '100%'
        }}>
          {/* Sección 1: Detalles del producto seleccionado - completamente visible */}
          <div style={{ 
            flexShrink: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <ProductoDetalles 
              producto={productoId ? productos.find(p => p.id === parseInt(productoId)) : null}
            />
          </div>
          
          {/* Sección 2: Cantidad, notas y agregar - completamente visible */}
          <div style={{ 
            flexShrink: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <CantidadNotasAgregar
              cantidad={cantidad}
              setCantidad={setCantidad}
              nota={nota}
              setNota={setNota}
              onAgregar={agregarItem}
              productoSeleccionado={productoId}
              showAgregado={showAgregado}
              ajustarBotones
            />
          </div>
        </div>
        
        {/* Columna 3: PedidoTipoForm + PedidoItemsListPedido */}
        <div style={{
          padding: '20px 20px 0 16px',
          minWidth: 0,
          minHeight: 0,
          height: '100%',
          background: '#232323',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Sección 1: Tipo de pedido y datos */}
          <div style={{ flexShrink: 0, marginBottom: 18 }}>
            <PedidoTipoForm
              tipo={tipo}
              setTipo={setTipo}
              mesaId={mesaId}
              setMesaId={setMesaId}
              mesasLibres={mesas}
              clientName={clientName}
              setClientName={setClientName}
              deliveryLocation={deliveryLocation}
              setDeliveryLocation={setDeliveryLocation}
            />
          </div>
          {/* Sección 2: Lista de productos agregados, scrollable y flexible */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginBottom: 18 }}>
            <PedidoItemsListPedido
              items={items}
              onQuitar={quitarItem}
              productos={productos}
            />
          </div>
          {/* Sección 3: Botón confirmar, fijo y completo en la parte inferior */}
          <div style={{ 
            flexShrink: 0, 
            background: '#232323', 
            padding: '16px 0 20px 0', 
            zIndex: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.10)',
            position: 'relative'
          }}>            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (tipo === 'mesa' && !mesaId) || items.length === 0}
              className={styles.botonConfirmar}
              style={{ marginTop: 0, width: '100%', maxWidth: 480 }}
            >
              {pedidoTexts.confirmar}
            </button>
            {error && <div className={styles.errorMsg} style={{marginTop: 10}}>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevoPedido;
