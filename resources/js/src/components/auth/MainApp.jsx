// components/auth/MainApp.jsx
// Componente principal que maneja el flujo completo de autenticación

import React, { useState, useEffect } from 'react';
import AdminGateway from './AdminGateway';
import Login from '../../pages/Login';

const MainApp = ({ children }) => {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [workerAuthenticated, setWorkerAuthenticated] = useState(false);

  // Verificar si el admin ya está autenticado en este navegador
  useEffect(() => {
    const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
    setAdminAuthenticated(isAdminAuth);

    // Verificar si ya hay un trabajador logueado
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    setWorkerAuthenticated(!!usuario);
  }, []);

  // Función para cerrar sesión de admin (volver a mostrar el AdminGateway)
  const handleAdminLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('usuario'); // También cerrar sesión del trabajador
    setAdminAuthenticated(false);
    setWorkerAuthenticated(false);
  };

  // Función cuando el admin se autentica correctamente
  const handleAdminAuthenticated = () => {
    setAdminAuthenticated(true);
  };

  // Función cuando un trabajador se autentica correctamente
  const handleWorkerLogin = (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setWorkerAuthenticated(true);
  };

  // Si el admin no está autenticado, mostrar AdminGateway
  if (!adminAuthenticated) {
    return <AdminGateway onAdminAuthenticated={handleAdminAuthenticated} />;
  }

  // Si el admin está autenticado pero no hay trabajador logueado, mostrar Login de trabajadores
  if (!workerAuthenticated) {
    return (
      <div>
        {/* Botón para cerrar sesión de admin */}
        <div style={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 1000 
        }}>
          <button
            onClick={handleAdminLogout}
            style={{
              background: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(255, 68, 68, 0.3)'
            }}
            title="Cerrar sesión de administrador y volver a requerir autenticación"
          >
            🔒 Cerrar Sesión Admin
          </button>
        </div>
        
        <Login onLogin={handleWorkerLogin} />
      </div>
    );
  }

  // Si ambos están autenticados, mostrar la aplicación principal
  return (
    <div>
      {/* Botón para cerrar sesión de admin */}
      <div style={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        zIndex: 1000 
      }}>
        <button
          onClick={handleAdminLogout}
          style={{
            background: '#ff4444',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 8px rgba(255, 68, 68, 0.3)'
          }}
          title="Cerrar sesión de administrador y volver a requerir autenticación"
        >
          🔒 Cerrar Sesión Admin
        </button>
      </div>
      
      {children}
    </div>
  );
};

export default MainApp;
