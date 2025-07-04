// helpers/sanctumLogin.js
// Login seguro a Laravel Sanctum tras autenticación 2FA Firebase
// Sigue la documentación oficial de Laravel 12 para SPA + Sanctum

import axios from '../axiosConfig';

// Garantiza que la cookie CSRF se obtiene antes de cualquier login
export async function ensureSanctumCsrfCookie() {
  await axios.get('/sanctum/csrf-cookie');
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

export async function sanctumAdminLogin({ email, password }) {
  await ensureSanctumCsrfCookie();
  // Usar la ruta correcta del backend para login de admin
  const res = await axios.post('/api/admin/login', { email, password });
  return res.data;
}
