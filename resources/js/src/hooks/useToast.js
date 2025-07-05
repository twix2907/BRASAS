import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toastMsg, setToastMsg] = useState('');

  const showToast = useCallback((message, duration = 2000) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(''), duration);
  }, []);

  const hideToast = useCallback(() => {
    setToastMsg('');
  }, []);

  return {
    toastMsg,
    showToast,
    hideToast
  };
};