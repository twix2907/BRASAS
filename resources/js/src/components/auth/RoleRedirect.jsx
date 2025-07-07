// components/auth/RoleRedirect.jsx
// Componente que redirige automáticamente según el rol del usuario
// Usado principalmente cuando alguien navega manualmente a "/"

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const RoleRedirect = () => {
  const { user: usuario } = useUser();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  // Definir la primera ruta por defecto según el rol
  const getDefaultRoute = (role) => {
    switch (role) {
      case 'admin':
        return '/pedidos';
      case 'mesero':
        return '/mesas';
      case 'cajero':
        return '/caja';
      case 'cocina':
        return '/ordenes-activas';
      default:
        return '/pedidos';
    }
  };
  const defaultRoute = getDefaultRoute(usuario.role);
  return <Navigate to={defaultRoute} replace />;
};

export default RoleRedirect;
