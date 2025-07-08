import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

// Protege rutas según el contexto de usuario y admin
export default function AuthGate({ children }) {
  const { user } = useUser();
  const adminAuth = localStorage.getItem('admin_authenticated') === 'true';
  if (!adminAuth) return <Navigate to="/login" replace />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
