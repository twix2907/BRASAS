export const validateMesaName = (nombre, mesas, excludeId = null) => {
  if (!nombre.trim()) {
    return { isValid: false, error: 'El nombre de la mesa es requerido' };
  }

  const exists = mesas.some(mesa => 
    mesa.name.trim().toLowerCase() === nombre.trim().toLowerCase() && 
    mesa.id !== excludeId
  );

  if (exists) {
    return { isValid: false, error: 'Ya existe una mesa con ese nombre' };
  }

  return { isValid: true };
};

export const validatePersonas = (personas) => {
  if (personas < 1 || personas > 30) {
    return { isValid: false, error: 'El número de personas debe estar entre 1 y 30' };
  }
  return { isValid: true };
};