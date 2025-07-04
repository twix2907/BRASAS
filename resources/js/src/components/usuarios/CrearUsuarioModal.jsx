import React, { useState } from 'react';
import axios from '../../axiosConfig';

export default function CrearUsuarioModal({ open, onClose, onUsuarioCreado }) {
  const [form, setForm] = useState({
    name: '',
    username: '',
    pin: '',
    role: 'mesero',
    active: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.username || form.pin.length !== 4) {
      setError('Todos los campos son obligatorios y el PIN debe tener 4 dígitos.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/usuarios', form);
      setForm({ name: '', username: '', pin: '', role: 'mesero', active: true });
      if (onUsuarioCreado) onUsuarioCreado();
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al crear usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#232323', padding: 32, borderRadius: 12, minWidth: 320, color: '#fff', boxShadow: '0 2px 16px #0008' }}>
        <h2 style={{ color: '#ffd203', marginBottom: 16 }}>Crear usuario</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ffd203' }} />
          <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ffd203' }} />
          <input name="pin" placeholder="PIN (4 dígitos)" value={form.pin} onChange={handleChange} maxLength={4} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ffd203' }} />
          <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ffd203' }}>
            <option value="mesero">Mesero</option>
            <option value="cajero">Cajero</option>
            <option value="admin">Administrador</option>
          </select>
          <label style={{ display: 'block', marginBottom: 10 }}>
            <input type="checkbox" name="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} /> Activo
          </label>
          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={onClose} style={{ background: '#aaa', color: '#232323', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ background: '#ffd203', color: '#010001', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
