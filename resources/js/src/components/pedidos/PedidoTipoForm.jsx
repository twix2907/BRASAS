import React from 'react';

// props: tipo, setTipo, mesaId, setMesaId, mesasLibres, clientName, setClientName, deliveryLocation, setDeliveryLocation
const PedidoTipoForm = ({ tipo, setTipo, mesaId, setMesaId, mesasLibres, clientName, setClientName, deliveryLocation, setDeliveryLocation }) => {
  return (
    <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <label htmlFor="tipo-select" style={{ color: '#ffd203', fontWeight: 700, fontSize: 18 }}>Tipo de pedido:</label>
        <select
          id="tipo-select"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          style={{ maxWidth: 180, width: '100%', fontSize: 16, borderRadius: 12, border: '2.5px solid #ffd203', padding: '0.7em 1.1em', background: '#232323', color: '#ffd203', fontWeight: 700, outline: 'none' }}
        >
          <option value="mesa">Mesa</option>
          <option value="para_llevar">Para llevar</option>
          <option value="delivery">Delivery</option>
        </select>
      </div>
      {tipo === 'mesa' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <label htmlFor="mesa-select" style={{ color: '#ffd203', fontWeight: 700, fontSize: 18 }}>Mesa:</label>
          <select
            id="mesa-select"
            value={mesaId}
            onChange={e => setMesaId(e.target.value)}
            style={{ maxWidth: 180, width: '100%', fontSize: 16, borderRadius: 12, border: '2.5px solid #ffd203', padding: '0.7em 1.1em', background: '#232323', color: '#ffd203', fontWeight: 700, outline: 'none' }}
          >
            <option value="">Selecciona mesa</option>
            {Array.isArray(mesasLibres) && mesasLibres.filter(m => m.active).map(mesa => (
              <option key={mesa.id} value={mesa.id}>{mesa.name || mesa.numero || mesa.id}</option>
            ))}
          </select>
        </div>
      )}
      {tipo === 'delivery' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="client-name" style={{ color: '#ffd203', fontWeight: 700, fontSize: 16 }}>Nombre del cliente:</label>
            <input
              id="client-name"
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              required
              placeholder="Nombre de quien recibe"
              style={{ padding: '0.5rem', borderRadius: 8, border: '2px solid #ffd203', fontSize: 16, background: '#181818', color: '#ffd203', fontWeight: 600 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="delivery-location" style={{ color: '#ffd203', fontWeight: 700, fontSize: 16 }}>Ubicación para delivery:</label>
            <input
              id="delivery-location"
              type="text"
              value={deliveryLocation}
              onChange={e => setDeliveryLocation(e.target.value)}
              required
              placeholder="Dirección o referencia"
              style={{ padding: '0.5rem', borderRadius: 8, border: '2px solid #ffd203', fontSize: 16, background: '#181818', color: '#ffd203', fontWeight: 600 }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PedidoTipoForm;
