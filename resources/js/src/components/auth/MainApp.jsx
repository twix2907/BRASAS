// components/auth/MainApp.jsx
// Componente principal que maneja el flujo completo de autenticación


import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import AdminGateway from './AdminGateway';
import Login from '../../pages/Login';
import LayoutBase from '../LayoutBase';

const MainApp = () => {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [workerAuthenticated, setWorkerAuthenticated] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Verificar si el admin ya está autenticado en este navegador
  useEffect(() => {
    const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
    setAdminAuthenticated(isAdminAuth);
    setWorkerAuthenticated(!!user);
    // eslint-disable-next-line
  }, [user]);

  // Función para cerrar sesión de admin (volver a mostrar el AdminGateway)
  const handleAdminLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    setUser(null); // También cerrar sesión del trabajador
    setAdminAuthenticated(false);
    setWorkerAuthenticated(false);
  };

  // Función cuando el admin se autentica correctamente
  const handleAdminAuthenticated = () => {
    setAdminAuthenticated(true);
  };

  // Función cuando un trabajador se autentica correctamente
  const handleWorkerLogin = (usuario) => {
    setUser(usuario);
    setWorkerAuthenticated(true);
    // Navegar a la ruta raíz y dejar que RoleRedirect maneje la redirección
    // Esto evita doble redirección y elimina el parpadeo
    navigate('/', { replace: true });
  };

  // Si el admin no está autenticado, mostrar AdminGateway
  if (!adminAuthenticated) {
    return <AdminGateway onAdminAuthenticated={handleAdminAuthenticated} />;
  }

  // Si el admin está autenticado pero no hay trabajador logueado, mostrar Login de trabajadores
  if (!workerAuthenticated) {
    return (
      <div>
        <Login onLogin={handleWorkerLogin} />
      </div>
    );
  }

  // Si ambos están autenticados, mostrar la aplicación principal con LayoutBase
  // Obtener usuario autenticado de localStorage
  return (
    <LayoutBase user={user} />
  );
};

export default MainApp;
