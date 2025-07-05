import React, { useState, useEffect } from 'react';
import '../App.css';


// Obtiene usuarios reales desde la API

export default function Login({ onLogin }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/usuarios?active=1')
      .then(res => res.json())
      .then(data => {
        // Solo usuarios activos (por seguridad, aunque ya se filtra en backend)
        setUsuarios(data.filter(u => u.active));
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar la lista de usuarios.');
        setLoading(false);
      });
  }, []);

  const handleUsuarioClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setPin('');
    setError('');
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) setPin(value);
  };

  // Utilidad para leer cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Espera hasta que la cookie de sesión esté presente
  async function ensureSessionCookie() {
    // Primero pide el CSRF
    await fetch('http://localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include',
    });
    // Si ya está la cookie de sesión, sigue
    if (getCookie('laravel_session')) return;
    // Si no, fuerza una petición dummy para crear la sesión
    await fetch('http://localhost:8000/api/session-status', {
      credentials: 'include',
    });
    // Espera hasta que la cookie esté presente (máx 500ms)
    let tries = 0;
    while (!getCookie('laravel_session') && tries < 10) {
      await new Promise(res => setTimeout(res, 50));
      tries++;
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    // Forzar blur del input para evitar submit doble por Enter
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      document.activeElement.blur();
    }
    console.log('submit', { pin, isSubmitting, usuarioSeleccionado });
    if (isSubmitting) return;
    if (pin.length !== 4) {
      setError('El PIN debe tener 4 dígitos.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      // 1. Asegura que la cookie de sesión esté presente
      await ensureSessionCookie();
      const xsrfToken = getCookie('XSRF-TOKEN');
      // 2. Hacer login con el header X-XSRF-TOKEN
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        },
        credentials: 'include',
        body: JSON.stringify({ username: usuarioSeleccionado.username, pin })
      });
      
      console.log('Response status:', res.status, 'ok:', res.ok);
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'PIN incorrecto');
        setIsSubmitting(false);
        return;
      }
      
      const text = await res.text();
      console.log('Response text:', text);
      
      if (!text) {
        setError('Respuesta vacía del servidor');
        setIsSubmitting(false);
        return;
      }
      
      const user = JSON.parse(text);
      console.log('User parsed:', user);
      onLogin(user);
    } catch (err) {
      console.error('Login error:', err);
      setError('Error de conexión con el servidor');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bienvenida-brasas" style={{ minHeight: '100vh', height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#232323', padding: 0, marginTop: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: 24 }}>
        <div className="login-logo-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
          <img
            src="/logo_brasas.jpg"
            alt="Logo D'Brasas y Carbón"
            style={{ width: 110, height: 110, objectFit: 'contain', borderRadius: '50%', boxShadow: '0 2px 16px 0 #ffd20355', background: '#232323', marginBottom: 12 }}
            draggable="false"
          />
          <h1 style={{ color: '#ffd203', fontFamily: 'inherit', fontWeight: 900, fontSize: '2.1rem', margin: 0, letterSpacing: 1 }}>D'Brasas y Carbón</h1>
          <span style={{ color: '#fffbe7', fontSize: '1.1rem', fontWeight: 500, marginTop: 2, fontStyle: 'italic', letterSpacing: 0.5 }}>El sabor auténtico a la brasa</span>
        </div>
        <div style={{ width: '100vw', maxWidth: '100vw', background: 'none', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0, overflow: 'visible', padding: 0, margin: 0 }}>
          <h2 className="titulo-brasas" style={{ fontSize: '2rem', color: '#ffd203', textAlign: 'center' }}>Iniciar sesión</h2>
          {!usuarioSeleccionado ? (
            <>
              <p style={{ color: '#fffbe7', textAlign: 'center' }}>Selecciona tu usuario:</p>
              {loading ? (
                <p style={{ color: '#fffbe7', textAlign: 'center' }}>Cargando usuarios...</p>
              ) : (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  width: '100%',
                  maxWidth: 900,
                  margin: '0 auto',
                  padding: 0,
                  boxSizing: 'border-box',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  overflow: 'visible',
                }}>
                  {/* Centrado visual: usuarios siempre centrados, máximo 5 por fila */}
                  {(() => {
                    if (usuarios.length === 0) return null;
                    
                    return usuarios.map((u) => (
                      <button
                        key={u.id}
                        className="btn-usuario"
                        onClick={() => handleUsuarioClick(u)}
                        style={{
                          padding: '1rem 1.5rem',
                          borderRadius: '1rem',
                          background: '#ffd203',
                          color: '#010001',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          width: '160px',
                          height: '80px',
                          minWidth: '160px',
                          minHeight: '80px',
                          maxWidth: '160px',
                          maxHeight: '80px',
                          flexShrink: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          boxSizing: 'border-box'
                        }}
                      >
                        {u.name}<br /><span style={{ fontSize: '0.9rem', color: '#333' }}>{u.role}</span>
                      </button>
                    ));
                  })()}
                  {usuarios.length === 0 && (
                    <p style={{ color: '#fffbe7', textAlign: 'center', width: '100%' }}>No hay usuarios activos.</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleLogin} style={{ marginTop: '1.5rem', width: '100%', maxWidth: 340, marginLeft: 'auto', marginRight: 'auto', background: 'none', padding: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', boxSizing: 'border-box' }}>
                <p style={{ width: '100%', textAlign: 'center', marginBottom: 8, color: '#fffbe7' }}>Usuario: <b>{usuarioSeleccionado.name}</b> <button type="button" onClick={() => setUsuarioSeleccionado(null)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#ffd203', cursor: 'pointer' }}>Cambiar</button></p>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="PIN de 4 dígitos"
                  autoFocus
                  style={{ fontSize: '1.5rem', padding: '0.5rem 1rem', borderRadius: '0.7rem', border: '1px solid #ffd203', textAlign: 'center', width: '100%', maxWidth: 220, marginBottom: 0, boxSizing: 'border-box' }}
                />
                {/* Aquí iría el input de contraseña y el de código SMS si aplica para admin */}
                {/* <input ... style={{ width: '100%', maxWidth: 220, ... }} /> */}
              </div>
              <button type="submit" disabled={isSubmitting || pin.length !== 4} style={{ padding: '0.7rem 2.5rem', borderRadius: '1rem', background: isSubmitting || pin.length !== 4 ? '#ffe066' : '#ffd203', color: '#010001', fontWeight: 700, border: 'none', cursor: isSubmitting || pin.length !== 4 ? 'not-allowed' : 'pointer', fontSize: '1.1rem', marginTop: 18, width: '100%', maxWidth: 220, opacity: isSubmitting || pin.length !== 4 ? 0.7 : 1 }}>Entrar</button>
              {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
