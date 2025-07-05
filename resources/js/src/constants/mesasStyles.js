export const STYLES = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    boxSizing: 'border-box',
    minHeight: 0,
    overflow: 'hidden'
  },
  
  content: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 0,
    overflow: 'hidden'
  },

  title: {
    color: '#ffd203',
    marginBottom: 24,
    fontSize: '2rem',
    textAlign: 'center',
    flexShrink: 0
  },

  form: {
    marginBottom: 32,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexShrink: 0
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
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    width: '100%',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflowY: 'auto',
    minHeight: 0,
    paddingBottom: 24,
    boxSizing: 'border-box'
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
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0
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