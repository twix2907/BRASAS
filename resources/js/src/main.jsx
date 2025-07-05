import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from './axiosConfig';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Mesas from './pages/Mesas.jsx';
import Productos from './pages/Productos.jsx';
import Pedidos from './pages/Pedidos.jsx';
import OrdenesActivas from './pages/OrdenesActivas.jsx';
import Usuarios from './pages/Usuarios.jsx';
import MenuPublico from './pages/MenuPublico.jsx';
import ProtectedApp from './ProtectedApp.jsx';
import { printTicket, vistaPreviaTicket } from './helpers/printTicket';
import './index.css';

// Inicializar cookie CSRF una sola vez al cargar la aplicación
(async () => {
  try {
    await axios.get('/sanctum/csrf-cookie');
    console.log('Cookie CSRF inicializada');
  } catch (error) {
    console.warn('Error al inicializar cookie CSRF:', error);
  }
})();

// Simulación de autenticación usando localStorage
function isAuthenticated() {
  return !!localStorage.getItem('usuario');
}

function Root() {
  // Asignar funciones de impresión a window globalmente
  useEffect(() => {
    window.printTicket = printTicket;
    window.vistaPreviaTicket = vistaPreviaTicket;
    return () => {
      delete window.printTicket;
      delete window.vistaPreviaTicket;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública para la carta/menú accesible por QR */}
        <Route path="/menu" element={<MenuPublico />} />
        <Route path="/login" element={
          isAuthenticated()
            ? <Navigate to="/" />
            : <Login onLogin={(usuario) => {
                localStorage.setItem('usuario', JSON.stringify(usuario));
                window.location.href = '/';
              }} />
        } />
        <Route path="/" element={isAuthenticated() ? <ProtectedApp><App /></ProtectedApp> : <Navigate to="/login" />} />
        <Route path="/mesas" element={isAuthenticated() ? <ProtectedApp><Mesas /></ProtectedApp> : <Navigate to="/login" />} />
        <Route path="/productos" element={isAuthenticated() ? <ProtectedApp><Productos /></ProtectedApp> : <Navigate to="/login" />} />
        <Route path="/pedidos" element={isAuthenticated() ? <ProtectedApp><Pedidos /></ProtectedApp> : <Navigate to="/login" />} />
        <Route path="/ordenes-activas" element={isAuthenticated() ? <ProtectedApp><OrdenesActivas /></ProtectedApp> : <Navigate to="/login" />} />
        <Route path="/usuarios" element={isAuthenticated() ? <ProtectedApp><Usuarios /></ProtectedApp> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
