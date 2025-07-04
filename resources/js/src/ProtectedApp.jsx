import React from 'react';
import { useSessionWatcher } from './hooks/useSessionWatcher';

export default function ProtectedApp({ children }) {
  useSessionWatcher();
  return children;
}
