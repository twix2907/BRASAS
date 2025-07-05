export const STYLES = {
  container: {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    background: '#222',
    zIndex: 0,
  },
  
  content: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },

  title: {
    color: '#ffd203',
    marginBottom: 24,
  },

  form: {
    marginBottom: 32,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },

  input: {
    padding: '0.7rem 1.2rem',
    borderRadius: '0.7rem',
    border: '1px solid #ffd203',
    fontSize: '1.1rem',
  },

  button: {
    primary: {
      padding: '0.7rem 1.5rem',
      borderRadius: '1rem',
      background: '#ffd203',
      color: '#010001',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.1rem',
    },
  },

  mesasGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginTop: 24,
    width: '100%',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 220px)', // Ajusta según el alto del header/formulario
    paddingBottom: 24,
  },

  toast: {
    position: 'fixed',
    top: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#ffd203',
    color: '#010001',
    fontWeight: 900,
    fontSize: '1.1rem',
    padding: '0.8rem 2rem',
    borderRadius: 14,
    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.13)',
    zIndex: 9999,
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },

  loadingText: {
    color: '#fff',
    fontSize: '1.2rem',
  },

  errorText: {
    color: 'red',
    marginBottom: 16,
  },

  emptyState: {
    color: '#fff',
    gridColumn: '1 / -1',
    textAlign: 'center',
    fontSize: '1.1rem',
  },
};