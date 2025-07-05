import React from 'react';
import NuevoPedido from './NuevoPedido';


function Pedidos() {
  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxSizing: 'border-box',
      minHeight: 0,
      overflow: 'hidden'
    }}>
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <NuevoPedido />
      </div>
    </div>
  );
}

export default Pedidos;
