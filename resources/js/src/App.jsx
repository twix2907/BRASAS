import './App.css'
import React, { useState } from 'react';
import axios from './axiosConfig';
import { useSessionWatcher } from './hooks/useSessionWatcher';

function App() {
  // Obtener usuario autenticado
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  useSessionWatcher();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  return (
    <div className="contenedor-principal">
      <div className="logo-brasas-wrapper">
        <img src="/logo_brasas.jpg" alt="Logo D'Brasas y Carbón" className="logo-brasas" draggable="false" />
      </div>
      <main className="bienvenida-brasas">
        <h1 className="titulo-brasas">D'Brasas y Carbón</h1>
        <h2 className="eslogan-brasas">El sabor auténtico a la brasa</h2>
        <p className="subtexto">Bienvenido al sistema de gestión del restaurante</p>
        {usuario && (
          <div style={{ marginTop: '2rem' }}>
            <span style={{ color: '#ffd203', fontWeight: 700 }}>
              Usuario: {usuario.name} ({usuario.role})
            </span>
            <button onClick={handleLogout} style={{ marginLeft: 16, padding: '0.5rem 1.2rem', borderRadius: '0.7rem', background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' }}>Cerrar sesión</button>
            <div style={{ marginTop: 24 }}>
              <a href="/mesas" style={{ marginRight: 16, color: '#ffd203', fontWeight: 600, textDecoration: 'none' }}>Mesas</a>
              <a href="/productos" style={{ marginRight: 16, color: '#ffd203', fontWeight: 600, textDecoration: 'none' }}>Productos</a>
              <a href="/pedidos" style={{ marginRight: 16, color: '#ffd203', fontWeight: 600, textDecoration: 'none' }}>Pedidos</a>
              <a href="/ordenes-activas" style={{ marginRight: 16, color: '#ffd203', fontWeight: 600, textDecoration: 'none' }}>Órdenes Activas</a>
              <a href="/usuarios" style={{ color: '#ffd203', fontWeight: 600, textDecoration: 'none' }}>Usuarios</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App
