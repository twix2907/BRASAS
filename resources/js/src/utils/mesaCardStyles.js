export const getMesaCardStyles = (active, ocupada) => {
  const baseButtonStyle = {
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    textDecoration: 'none',
  };

  return {
    card: {
      background: !active ? '#555' : ocupada ? '#3a1818' : '#232323',
      color: !active ? '#aaa' : ocupada ? '#ff4d4f' : '#ffd203',
      border: ocupada ? '2.5px solid #ff4d4f' : '2px solid #ffd203',
      borderRadius: 18,
      boxShadow: ocupada 
        ? '0 2px 12px 0 rgba(255,77,79,0.10)' 
        : '0 1px 4px 0 rgba(0,0,0,0.10)',
      opacity: active ? 1 : 0.6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: 180,
      height: 220,
      padding: '0 12px',
      transition: 'all 0.2s',
      position: 'relative',
      cursor: ocupada && active ? 'pointer' : 'default',
    },

    header: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 4,
    },

    icon: {
      marginBottom: 10,
      color: ocupada ? '#ff4d4f' : '#ffd203',
      opacity: active ? 1 : 0.5,
    },

    nameContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },

    name: {
      fontWeight: 900,
      fontSize: '1.25rem',
      textAlign: 'center',
      flex: 1,
    },

    editButton: {
      marginLeft: 6,
      background: 'none',
      color: '#ffd203',
      border: 'none',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1,
      padding: 0,
      verticalAlign: 'middle',
    },

    status: {
      fontSize: 13,
      color: ocupada ? '#ff4d4f' : '#fff',
      fontWeight: 700,
      marginBottom: 2,
    },

    activeOrder: {
      fontSize: 13,
      color: '#ff4d4f',
      fontWeight: 700,
    },

    createOrderButton: {
      ...baseButtonStyle,
      display: 'inline-block',
      marginTop: 10,
      background: '#ffd203',
      color: '#010001',
      padding: '0.5rem 1.1rem',
      fontWeight: 800,
      fontSize: 15,
      width: '90%',
    },

    disabledButton: {
      ...baseButtonStyle,
      marginTop: 10,
      background: '#aaa',
      color: '#888',
      padding: '0.5rem 1.1rem',
      fontWeight: 800,
      fontSize: 15,
      cursor: 'not-allowed',
      opacity: 0.7,
      width: '80%',
      maxWidth: 150,
    },

    occupancyButton: (isActive) => ({
      ...baseButtonStyle,
      marginTop: 8,
      background: '#232323',
      color: '#ffd203',
      border: '1.5px solid #ffd203',
      padding: '0.35rem 0.8rem',
      fontSize: 13,
      cursor: !isActive ? 'not-allowed' : 'pointer',
      opacity: !isActive ? 0.5 : 1,
      width: '90%',
    }),

    toggleButton: (isActive) => ({
      ...baseButtonStyle,
      marginTop: 6,
      background: isActive ? '#ff4d4f' : '#ffd203',
      color: isActive ? '#fff' : '#010001',
      padding: '0.35rem 0.8rem',
      fontSize: 13,
      width: '90%',
    }),
  };
};