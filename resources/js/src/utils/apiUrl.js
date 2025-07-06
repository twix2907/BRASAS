// Utilidad para obtener la URL base de la API
export const getApiUrl = () => {
  // 1. Prioridad: Variable de entorno VITE_API_URL (desarrollo o configuración manual)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. En entorno de desarrollo sin VITE_API_URL (localhost)
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000';
  }
  
  // 3. En producción, usar el mismo dominio (Railway, Vercel, etc.)
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol; // https: o http:
    const host = window.location.host; // domain.com:port
    return `${protocol}//${host}`;
  }
  
  // 4. Fallback solo para SSR o casos extraños
  return '';
};

// Función para crear URLs completas de la API
export const apiUrl = (path) => {
  const baseUrl = getApiUrl();
  
  // Si no hay baseUrl (error), usar path relativo
  if (!baseUrl) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
