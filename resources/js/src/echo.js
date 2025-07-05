import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

console.log('[Echo] Iniciando configuración de Echo');
console.log('[Echo] Variables de entorno:', {
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  host: import.meta.env.VITE_PUSHER_HOST,
  port: import.meta.env.VITE_PUSHER_PORT,
  scheme: import.meta.env.VITE_PUSHER_SCHEME
});

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  wsHost: import.meta.env.VITE_PUSHER_HOST || `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
  wsPort: import.meta.env.VITE_PUSHER_PORT || 80,
  wssPort: import.meta.env.VITE_PUSHER_PORT || 443,
  forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
});
console.log('[Echo] Echo inicializado:', echo);
console.log('[Echo] Estado de conexión:', echo.connector.pusher.connection.state);

export default echo;
