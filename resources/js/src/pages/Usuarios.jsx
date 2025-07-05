import React, { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import axios from '../axiosConfig';

export default function Usuarios() {
  const { usuarios, loading, error, refetch } = useUsuarios();
  const [form, setForm] = useState({ name: '', username: '', role: 'mesero', pin: '' }); // default sigue siendo mesero
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // { [userId_action]: true }
  const [pinModal, setPinModal] = useState({ open: false, user: null });
  const [pinChange, setPinChange] = useState({ current: '', newPin: '', confirm: '', error: '', saving: false });
  const [confirmAction, setConfirmAction] = useState(null); // { type, user }

  // Cargar usuario en formulario para editar
  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({ name: user.name, username: user.username, role: user.role, pin: '' });
    setFormError('');
  };

  // Inhabilitar/reactivar usuario
  const handleToggleActive = async (user) => {
    setActionLoading(al => ({ ...al, [user.id + '_toggle']: true }));
    try {
      if (user.active) {
        // Inhabilitar
        await axios.delete(`/api/usuarios/${user.id}`);
      } else {
        // Reactivar
        await axios.post(`/api/usuarios/${user.id}/reactivate`);
      }
      refetch();
    } catch (e) {
      alert('Error al cambiar estado del usuario');
    } finally {
      setActionLoading(al => ({ ...al, [user.id + '_toggle']: false }));
    }
  };

  // Resetear PIN (admin)
  const handleResetPin = async (user) => {
    setActionLoading(al => ({ ...al, [user.id + '_reset']: true }));
    try {
      await axios.post(`/api/usuarios/${user.id}/reset-pin`);
      alert('PIN reseteado a 0000');
      refetch();
    } catch (e) {
      alert('Error al resetear PIN');
    } finally {
      setActionLoading(al => ({ ...al, [user.id + '_reset']: false }));
    }
  };

  // Forzar cierre de sesión (admin)
  const handleForceLogout = async (user) => {
    setActionLoading(al => ({ ...al, [user.id + '_logout']: true }));
    try {
      await axios.post(`/api/usuarios/${user.id}/force-logout`);
      refetch();
    } catch (e) {
      alert('Error al forzar cierre de sesión');
    } finally {
      setActionLoading(al => ({ ...al, [user.id + '_logout']: false }));
    }
  };

  // Abrir modal para cambiar PIN (usuario)
  const openPinModal = (user) => {
    setPinModal({ open: true, user });
    setPinChange({ current: '', newPin: '', confirm: '', error: '', saving: false });
  };

  // Cambiar PIN (usuario)
  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinChange(pc => ({ ...pc, error: '' }));
    if (!/^\d{4}$/.test(pinChange.newPin)) {
      setPinChange(pc => ({ ...pc, error: 'El nuevo PIN debe tener 4 dígitos.' }));
      return;
    }
    if (pinChange.newPin !== pinChange.confirm) {
      setPinChange(pc => ({ ...pc, error: 'Los PIN no coinciden.' }));
      return;
    }
    setPinChange(pc => ({ ...pc, saving: true }));
    try {
      await axios.post(`/api/usuarios/${pinModal.user.id}/change-pin`, {
        current_pin: pinChange.current,
        new_pin: pinChange.newPin
      });
      setPinModal({ open: false, user: null });
      refetch();
    } catch (e) {
      setPinChange(pc => ({ ...pc, error: 'Error de red', saving: false }));
    } finally {
      setPinChange(pc => ({ ...pc, saving: false }));
    }
  };

  // Limpiar formulario
  const resetForm = () => {
    setEditId(null);
    setForm({ name: '', username: '', role: 'mesero', pin: '' });
    setFormError('');
  };

  // Guardar usuario (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.username.trim() || !form.role) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    if (!editId && !/^\d{4}$/.test(form.pin)) {
      setFormError('El PIN debe tener 4 dígitos.');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`/api/usuarios/${editId}`, {
          name: form.name,
          username: form.username,
          role: form.role
        });
      } else {
        await axios.post('/api/usuarios', form);
      }
      resetForm();
      refetch();
    } catch (err) {
      setFormError('Error de red');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      background: '#222', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '24px',
      boxSizing: 'border-box',
      minHeight: 0,
      overflow: 'hidden'
    }}>
      <h2 style={{ color: '#ffd203', margin: '0 0 24px 0', textAlign: 'center', flexShrink: 0 }}>Gestión de Usuarios</h2>
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: 1400, 
        flex: 1, 
        gap: 32, 
        alignSelf: 'center',
        minHeight: 0
      }}>
        {/* Formulario crear/editar usuario */}
        <div style={{ flex: '0 0 340px', background: '#232323', borderRadius: 18, padding: 24, minHeight: 420, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
          <div style={{ color: '#ffd203', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>{editId ? 'Editar usuario' : 'Crear usuario'}</div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{ marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203', fontSize: 15, marginBottom: 8, background: '#232323', color: '#ffd203' }}
                disabled={saving}
              />
              <input
                type="text"
                placeholder="Usuario"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203', fontSize: 15, marginBottom: 8, background: '#232323', color: '#ffd203' }}
                disabled={saving}
              />
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203', fontSize: 15, marginBottom: 8, background: '#232323', color: '#ffd203' }}
                disabled={saving}
              >
                <option value="mesero">Mesero</option>
                <option value="cajero">Cajero</option>
                <option value="cocina">Cocina</option>
                <option value="admin">Administrador</option>
              </select>
              {!editId && (
                <input
                  type="password"
                  placeholder="PIN (4 dígitos)"
                  value={form.pin}
                  onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203', fontSize: 15, marginBottom: 8, background: '#232323', color: '#ffd203' }}
                  disabled={saving}
                />
              )}
            </div>
            {formError && <div style={{ color: 'red', marginBottom: 10 }}>{formError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '0.7rem', borderRadius: 8, background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', fontSize: 16, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{editId ? 'Guardar cambios' : 'Crear usuario'}</button>
              {editId && <button type="button" onClick={resetForm} disabled={saving} style={{ flex: 1, padding: '0.7rem', borderRadius: 8, background: '#232323', color: '#ffd203', fontWeight: 700, border: '1px solid #ffd203', fontSize: 16, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>Cancelar</button>}
            </div>
          </form>
        </div>
        {/* Lista de usuarios */}
        <div style={{ 
          flex: 1, 
          minWidth: 0,
          background: '#232323', 
          borderRadius: 18, 
          padding: 24, 
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          <div style={{ color: '#ffd203', fontWeight: 700, fontSize: 18, marginBottom: 18, flexShrink: 0 }}>Lista de usuarios</div>
          {loading ? (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff' 
            }}>Cargando usuarios...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <div style={{ 
              flex: 1, 
              minHeight: 0, 
              overflowY: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'none' }}>
              <thead>
                <tr style={{ color: '#ffd203', fontWeight: 700, fontSize: 15, background: 'none' }}>
                  <th style={{ padding: 8, textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Usuario</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Rol</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Estado</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Último acceso</th>
                  <th style={{ padding: 8, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} style={{ background: u.active ? 'none' : '#444', color: u.active ? '#ffd203' : '#aaa', opacity: u.active ? 1 : 0.6 }}>
                    <td style={{ padding: 8 }}>{u.name}</td>
                    <td style={{ padding: 8 }}>{u.username}</td>
                    <td style={{ padding: 8 }}>{u.role}</td>
                    <td style={{ padding: 8 }}>{u.active ? 'Activo' : 'Inhabilitado'}</td>
                    <td style={{ padding: 8 }}>{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : '-'}</td>
                    <td style={{ padding: 8, textAlign: 'center', display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(u)} style={{ background: 'none', color: '#ffd203', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }} title="Editar">✎</button>
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={actionLoading[u.id + '_toggle']}
                        style={{ background: 'none', color: u.active ? '#ff5252' : '#4caf50', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                        title={u.active ? 'Inhabilitar' : 'Reactivar'}
                      >{u.active ? '⏸' : '▶'}</button>
                      <button
                        onClick={() => handleResetPin(u)}
                        disabled={actionLoading[u.id + '_reset']}
                        style={{ background: 'none', color: '#ffd203', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                        title="Resetear PIN"
                      >🔑</button>
                      <button
                        onClick={() => handleForceLogout(u)}
                        disabled={actionLoading[u.id + '_logout']}
                        style={{ background: 'none', color: '#ffd203', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                        title="Forzar cierre de sesión"
                      >🚪</button>
                      <button
                        onClick={() => openPinModal(u)}
                        style={{ background: 'none', color: '#ffd203', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                        title="Cambiar PIN"
                      >🔒</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    {/* Modal cambiar PIN */}
    {pinModal.open && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#232323', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)' }}>
          <div style={{ color: '#ffd203', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Cambiar PIN de {pinModal.user.name}</div>
          <form onSubmit={handleChangePin} autoComplete="off">
            <input
              type="password"
              placeholder="PIN actual"
              value={pinChange.current}
              onChange={e => setPinChange(pc => ({ ...pc, current: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203', fontSize: 15, marginBottom: 8, background: '#232323', color: '#ffd203' }}
              disabled={pinChange.saving}
            />
            <input
              type="password"
              placeholder="Nuevo PIN (4 dígitos)"
              value={pinChange.newPin}
              onChange={e => setPinChange(pc => ({ ...pc, newPin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203', fontSize: 15, marginBottom: 8, background: '#232323', color: '#ffd203' }}
              disabled={pinChange.saving}
            />
            <input
              type="password"
              placeholder="Confirmar nuevo PIN"
              value={pinChange.confirm}
              onChange={e => setPinChange(pc => ({ ...pc, confirm: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203', fontSize: 15, marginBottom: 8, background: '#232323', color: '#ffd203' }}
              disabled={pinChange.saving}
            />
            {pinChange.error && <div style={{ color: 'red', marginBottom: 10 }}>{pinChange.error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={pinChange.saving} style={{ flex: 1, padding: '0.7rem', borderRadius: 8, background: '#ffd203', color: '#010001', fontWeight: 700, border: 'none', fontSize: 16, cursor: 'pointer', opacity: pinChange.saving ? 0.7 : 1 }}>Cambiar PIN</button>
              <button type="button" onClick={() => setPinModal({ open: false, user: null })} disabled={pinChange.saving} style={{ flex: 1, padding: '0.7rem', borderRadius: 8, background: '#232323', color: '#ffd203', fontWeight: 700, border: '1px solid #ffd203', fontSize: 16, cursor: 'pointer', opacity: pinChange.saving ? 0.7 : 1 }}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
}
