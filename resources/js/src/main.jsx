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
import MainApp from './components/auth/MainApp.jsx';
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
  // Verificar que tanto admin como trabajador estén autenticados
  const adminAuth = localStorage.getItem('admin_authenticated') === 'true';
  const workerAuth = !!localStorage.getItem('usuario');
  return adminAuth && workerAuth;
}

function isOnlyAdminAuthenticated() {
  // Solo el admin está autenticado, pero no hay trabajador logueado
  const adminAuth = localStorage.getItem('admin_authenticated') === 'true';
  const workerAuth = !!localStorage.getItem('usuario');
  return adminAuth && !workerAuth;
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
        
        {/* Ruta de login - ahora maneja todo el flujo de autenticación */}
        <Route path="/login" element={
          isAuthenticated()
            ? <Navigate to="/" />
            : <MainApp>
                <Login onLogin={(usuario) => {
                  localStorage.setItem('usuario', JSON.stringify(usuario));
                  window.location.href = '/';
                }} />
              </MainApp>
        } />
        
        {/* Rutas protegidas - requieren autenticación completa */}
        <Route path="/" element={
          isAuthenticated() 
            ? <MainApp><ProtectedApp><App /></ProtectedApp></MainApp>
            : <Navigate to="/login" />
        } />
        <Route path="/mesas" element={
          isAuthenticated() 
            ? <MainApp><ProtectedApp><Mesas /></ProtectedApp></MainApp>
            : <Navigate to="/login" />
        } />
        <Route path="/productos" element={
          isAuthenticated() 
            ? <MainApp><ProtectedApp><Productos /></ProtectedApp></MainApp>
            : <Navigate to="/login" />
        } />
        <Route path="/pedidos" element={
          isAuthenticated() 
            ? <MainApp><ProtectedApp><Pedidos /></ProtectedApp></MainApp>
            : <Navigate to="/login" />
        } />
        <Route path="/ordenes-activas" element={
          isAuthenticated() 
            ? <MainApp><ProtectedApp><OrdenesActivas /></ProtectedApp></MainApp>
            : <Navigate to="/login" />
        } />
        <Route path="/usuarios" element={
          isAuthenticated() 
            ? <MainApp><ProtectedApp><Usuarios /></ProtectedApp></MainApp>
            : <Navigate to="/login" />
        } />
        
        {/* Redirección por defecto */}
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
