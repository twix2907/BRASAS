// Debug: Para diagnosticar problemas de URLs en Railway
// Este archivo se puede eliminar después de solucionar el problema

import { getApiUrl, apiUrl } from '../utils/apiUrl';

export const debugUrls = () => {
  console.log('=== DEBUG URLS ===');
  console.log('window.location.hostname:', window.location.hostname);
  console.log('window.location.protocol:', window.location.protocol);
  console.log('window.location.host:', window.location.host);
  console.log('window.location.href:', window.location.href);
  
  // Test de la función getApiUrl
  const baseUrl = getApiUrl();
  console.log('getApiUrl() result:', baseUrl);
  console.log('apiUrl("/api/test"):', apiUrl('/api/test'));
  console.log('===============');
};
