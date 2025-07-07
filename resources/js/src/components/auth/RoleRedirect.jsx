// components/auth/RoleRedirect.jsx
// Componente que redirige automáticamente según el rol del usuario

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const RoleRedirect = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // Definir la primera ruta por defecto según el rol
  const getDefaultRoute = (role) => {
    switch (role) {
      case 'admin':
        return '/pedidos'; // Admin puede ir a pedidos
      case 'mesero':
        return '/mesas'; // Mesero va directo a mesas
      case 'cajero':
        return '/caja'; // Cajero va directo a caja
      case 'cocina':
        return '/ordenes-activas'; // Cocina va directo a órdenes
      default:
        return '/pedidos';
    }
  };

  const defaultRoute = getDefaultRoute(usuario.role);
  
  return <Navigate to={defaultRoute} replace />;
};

export default RoleRedirect;
