import React, { useState } from 'react';
import { STYLES } from '../../constants/mesasStyles';

const MesaForm = ({ onSubmit, isLoading }) => {
  const [nombre, setNombre] = useState('');
  const [personas, setPersonas] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(nombre, personas);
    if (success) {
      setNombre('');
      setPersonas(1);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={STYLES.form}>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre o número de mesa"
        style={{ ...STYLES.input, minWidth: 180 }}
        disabled={isLoading}
        required
      />
      <input
        type="number"
        min={1}
        max={30}
        value={personas}
        onChange={(e) => setPersonas(Number(e.target.value))}
        placeholder="Personas"
        style={{ ...STYLES.input, width: 110 }}
        disabled={isLoading}
        required
      />
      <button
        type="submit"
        style={{
          ...STYLES.button.primary,
          opacity: isLoading ? 0.6 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Agregando...' : 'Agregar'}
      </button>
    </form>
  );
};

export default MesaForm;