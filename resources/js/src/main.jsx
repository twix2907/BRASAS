import React, { StrictMode, useEffect, useState, useRef } from 'react';
import { UserProvider } from './context/UserContext';
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
import RequireRole from './components/auth/RequireRole.jsx';
import RoleRedirect from './components/auth/RoleRedirect.jsx';
import LayoutBase from './components/LayoutBase.jsx';
import { printTicket, vistaPreviaTicket } from './helpers/printTicket';
import ModalVistaPreviaTicket from './components/ModalVistaPreviaTicket';
import './index.css';
import Caja from './pages/Caja.jsx';
import AuthGate from './components/auth/AuthGate.jsx';

// Inicializar cookie CSRF una sola vez al cargar la aplicación
(async () => {
  try {
    await axios.get('/sanctum/csrf-cookie');
    console.log('Cookie CSRF inicializada');
  } catch (error) {
    console.warn('Error al inicializar cookie CSRF:', error);
  }
})();


// Eliminado: isAuthenticated y isOnlyAdminAuthenticated. Ahora se usa AuthGate y contexto global.

import echo from './echo';


function Root() {
  // Estado para el modal de vista previa de ticket/comanda
  const [modalVistaPreviaOpen, setModalVistaPreviaOpen] = useState(false);
  const [modalVistaPreviaData, setModalVistaPreviaData] = useState(null);
  const [modalVistaPreviaTipo, setModalVistaPreviaTipo] = useState('comanda');
  const printQueueRef = useRef([]); // Para evitar superposiciones

  useEffect(() => {
    window.printTicket = printTicket;
    window.vistaPreviaTicket = (printData, tipo = 'comanda') => {
      setModalVistaPreviaData(printData);
      setModalVistaPreviaTipo(tipo);
      setModalVistaPreviaOpen(true);
    };

    // Suscripción global SOLO para cocina
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    let channelCocina;
    if (usuario && usuario.role === 'cocina') {
      channelCocina = echo.channel('impresion-cocina')
        .listen('ComandaParaImprimir', async (e) => {
          const printData = e.printData.pedido || e.printData;
          // Mostrar modal de vista previa en vez de pop-up
          setModalVistaPreviaData(printData);
          setModalVistaPreviaTipo('comanda');
          setModalVistaPreviaOpen(true);
          // Opcional: puedes poner en cola la impresión automática aquí si lo deseas
        });
    }
    return () => {
      delete window.printTicket;
      delete window.vistaPreviaTicket;
      if (channelCocina) channelCocina.stopListening('ComandaParaImprimir');
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública para la carta/menú accesible por QR */}
          <Route path="/menu" element={<MenuPublico />} />
          {/* Ruta de login: MainApp maneja el flujo completo (admin + trabajador) */}
          <Route path="/login" element={<MainApp />} />
          {/* Rutas protegidas: MainApp y children solo si ambos están autenticados */}
          <Route element={<AuthGate><MainApp /></AuthGate>}>
            <Route path="/" element={<ProtectedApp><RoleRedirect /></ProtectedApp>} />
            <Route path="/bienvenida" element={<ProtectedApp><App /></ProtectedApp>} />
            <Route path="/mesas" element={<ProtectedApp><RequireRole roles={["admin","mesero"]}><Mesas /></RequireRole></ProtectedApp>} />
            <Route path="/productos" element={<ProtectedApp><RequireRole roles={["admin"]}><Productos /></RequireRole></ProtectedApp>} />
            <Route path="/pedidos" element={<ProtectedApp><RequireRole roles={["admin","mesero","cajero"]}><Pedidos /></RequireRole></ProtectedApp>} />
            <Route path="/ordenes-activas" element={<ProtectedApp><RequireRole roles={["admin","cocina"]}><OrdenesActivas /></RequireRole></ProtectedApp>} />
            <Route path="/usuarios" element={<ProtectedApp><RequireRole roles={["admin"]}><Usuarios /></RequireRole></ProtectedApp>} />
            <Route path="/caja" element={<ProtectedApp><RequireRole roles={["admin","cajero"]}><Caja /></RequireRole></ProtectedApp>} />
          </Route>
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <ModalVistaPreviaTicket
        open={modalVistaPreviaOpen}
        onClose={() => setModalVistaPreviaOpen(false)}
        ticketData={modalVistaPreviaData}
        tipo={modalVistaPreviaTipo}
      />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <Root />
    </UserProvider>
  </StrictMode>
);
