import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

// roles: string | string[]
export default function RequireRole({ roles, children }) {
  const { user: usuario } = useUser();
  if (!usuario) return <Navigate to="/login" />;
  const noAccess = (typeof roles === 'string' && usuario.role !== roles) || (Array.isArray(roles) && !roles.includes(usuario.role));
  if (noAccess) {
    if (usuario.role === 'cajero') return <Navigate to="/caja" />;
    if (usuario.role === 'mesero') return <Navigate to="/mesas" />;
    if (usuario.role === 'cocina') return <Navigate to="/ordenes-activas" />;
    return <Navigate to="/" />;
  }
  return children;
}
