import { useEffect } from 'react';
import echo from '../echo';

export function useSessionWatcher() {
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log('[useSessionWatcher] Hook montado. Usuario en localStorage:', usuario);
    if (!usuario) return;
    const channel = echo.channel('users');
    const handler = (e) => {
      console.log('[useSessionWatcher] Evento UserActualizado recibido:', e);
      if (e.user) {
        console.log('[useSessionWatcher] Comparando IDs:', e.user.id, 'vs', usuario.id);
        if (e.user.id === usuario.id) {
          console.log('[useSessionWatcher] Coincide ID usuario. session_token evento:', e.user.session_token, 'session_token local:', usuario.session_token);
          // Si el session_token es null, expulsar. Si cambió pero sigue autenticado, actualizar localStorage.
          if (!e.user.session_token) {
            console.log('[useSessionWatcher] Expulsando usuario por cierre de sesión (token null)');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
          } else if (e.user.session_token !== usuario.session_token) {
            console.log('[useSessionWatcher] session_token cambió, actualizando usuario en localStorage');
            localStorage.setItem('usuario', JSON.stringify(e.user));
          } else {
            console.log('[useSessionWatcher] session_token NO cambió, no se expulsa');
          }
        }
      }
    };
    channel.listen('.App\\Events\\UserActualizado', handler);
    return () => {
      channel.stopListening('.App\\Events\\UserActualizado', handler);
    };
  }, []);
}
