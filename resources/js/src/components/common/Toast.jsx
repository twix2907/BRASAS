import React from 'react';
import { STYLES } from '../../constants/mesasStyles';

const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div style={STYLES.toast}>
      {message}
    </div>
  );
};

export default Toast;