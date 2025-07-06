import axios from 'axios';
import { getApiUrl } from './utils/apiUrl';

// Configuración global para Axios (Laravel Sanctum + Vite)
axios.defaults.baseURL = getApiUrl();
axios.defaults.withCredentials = true;

export default axios;
