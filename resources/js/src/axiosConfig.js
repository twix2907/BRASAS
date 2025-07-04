import axios from 'axios';

// Configuración global para Axios (Laravel Sanctum + Vite)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default axios;
