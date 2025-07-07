import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUtensils, FaCashRegister, FaTable, FaClipboardList, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import styled from 'styled-components';

const Sidebar = styled.nav`
  width: 80px;
  background: #010001;
  color: #ffd203;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 0 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  border-right: 2px solid #ffd203;
`;

const SidebarLink = styled(NavLink)`
  color: #ffd203;
  margin: 18px 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 12px;
  transition: background 0.2s;
  &.active, &:hover {
    background: #ffd20322;
    color: #fffbe7;
  }
`;

const LogoutButton = styled.button`
  color: #ffd203;
  margin: 18px 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 12px;
  transition: background 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    background: #ffd20322;
    color: #fffbe7;
  }
`;

const Main = styled.main`
  margin-left: 80px;
  height: 100vh;
  background: #010001;
  color: #ffd203;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  width: calc(100vw - 80px);
  box-sizing: border-box;
`;

const Header = styled.header`
  width: 100%;
  background: #232323;
  color: #ffd203;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 70px;
  border-bottom: 2px solid #ffd203;
`;

const Logo = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  margin-right: 16px;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
`;

const User = styled.div`
  font-size: 1rem;
  font-weight: 700;
`;

// Contenedor para las vistas que ocupen todo el espacio disponible
const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px); /* Altura total menos header */
  min-height: 0;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

export default function LayoutBase({ user }) {
  // Función para cerrar sesión directamente
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    window.location.href = '/login';
  };

  // Definir qué secciones puede ver cada rol
  const getAvailableSections = (userRole) => {
    const sections = [];

    // Todas las secciones disponibles con sus permisos
    const allSections = [
      { path: "/pedidos", icon: FaUtensils, title: "Pedidos", roles: ["admin", "mesero", "cajero"] },
      { path: "/caja", icon: FaCashRegister, title: "Caja", roles: ["admin", "cajero"] },
      { path: "/mesas", icon: FaTable, title: "Mesas", roles: ["admin", "mesero"] },
      { path: "/productos", icon: FaClipboardList, title: "Menú", roles: ["admin"] },
      { path: "/usuarios", icon: FaUsers, title: "Usuarios", roles: ["admin"] },
      { path: "/ordenes-activas", icon: FaChartBar, title: "Órdenes", roles: ["admin", "cocina"] }
    ];

    // Filtrar secciones según el rol del usuario
    allSections.forEach(section => {
      if (section.roles.includes(userRole)) {
        sections.push(section);
      }
    });

    return sections;
  };

  const userRole = user?.role || 'admin';
  const availableSections = getAvailableSections(userRole);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#010001' }}>
      <Sidebar>
        {availableSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <SidebarLink key={section.path} to={section.path} title={section.title}>
              <IconComponent />
            </SidebarLink>
          );
        })}
        <LogoutButton onClick={handleLogout} title="Cerrar sesión">
          <FaSignOutAlt />
        </LogoutButton>
      </Sidebar>
      <Main>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Logo src="/logo_brasas.jpg" alt="Logo" />
            <Title>D'Brasas y Carbón</Title>
          </div>
          <User>{user?.name || 'Usuario'}</User>
        </Header>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </Main>
    </div>
  );
}
