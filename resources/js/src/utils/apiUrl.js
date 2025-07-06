// Utilidad para obtener la URL base de la API
export const getApiUrl = () => {
  // Si estamos en desarrollo (localhost), usar localhost:8000
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  
  // Si hay variable de entorno VITE_API_URL, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // En producción sin variable de entorno, usar el mismo dominio
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Fallback
  return 'http://localhost:8000';
};

// Función para crear URLs completas de la API
export const apiUrl = (path) => {
  const baseUrl = getApiUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
