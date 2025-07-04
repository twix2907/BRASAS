import React, { useState, useEffect } from 'react';
import '../App.css';


// Obtiene usuarios reales desde la API

export default function Login({ onLogin }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('El PIN debe tener 4 dígitos.');
      return;
    }
    setError('');
    try {
      // 1. Solicitar cookie CSRF
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });

      // 2. Leer el valor de la cookie XSRF-TOKEN
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }
      const xsrfToken = getCookie('XSRF-TOKEN');

      // 3. Hacer login con el header X-XSRF-TOKEN
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        },
        credentials: 'include',
        body: JSON.stringify({ username: usuarioSeleccionado.username, pin })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'PIN incorrecto');
        return;
      }
      const user = await res.json();
      onLogin(user);
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="bienvenida-brasas">
      <h2 className="titulo-brasas" style={{ fontSize: '2rem' }}>Iniciar sesión</h2>
      {!usuarioSeleccionado ? (
        <>
          <p>Selecciona tu usuario:</p>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {usuarios.length === 0 ? (
                <p>No hay usuarios activos.</p>
              ) : (
                usuarios.map((u) => (
                  <button
                    key={u.id}
                    className="btn-usuario"
                    onClick={() => handleUsuarioClick(u)}
                    style={{ padding: '1rem 1.5rem', borderRadius: '1rem', background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                  >
                    {u.name}<br /><span style={{ fontSize: '0.9rem', color: '#333' }}>{u.role}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
          <p>Usuario: <b>{usuarioSeleccionado.name}</b> <button type="button" onClick={() => setUsuarioSeleccionado(null)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#ffd203', cursor: 'pointer' }}>Cambiar</button></p>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={pin}
            onChange={handlePinChange}
            placeholder="PIN de 4 dígitos"
            style={{ fontSize: '1.5rem', padding: '0.5rem 1rem', borderRadius: '0.7rem', border: '1px solid #ffd203', textAlign: 'center', width: '160px', marginBottom: '1rem' }}
          />
          <br />
          <button type="submit" style={{ padding: '0.7rem 2.5rem', borderRadius: '1rem', background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>Entrar</button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}
