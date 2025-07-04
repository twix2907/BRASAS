import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

export default function MenuPublico() {
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/menu')
      .then(res => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar la carta.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100dvh', width: '100vw', background: '#222', color: '#ffd203', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
      <header style={{ width: '100%', textAlign: 'center', padding: '2rem 0 1rem 0', background: '#010001' }}>
        <img src="/logo_brasas.jpg" alt="Logo" style={{ height: 60, marginBottom: 8 }} />
        <h1 style={{ fontFamily: 'Roboto, Nunito Sans, Arial', fontWeight: 900, fontSize: 32, margin: 0, color: '#ffd203' }}>D'Brasas y Carbón</h1>
        <div style={{ color: '#fff', fontSize: 18, marginTop: 4 }}>El sabor auténtico a la brasa</div>
      </header>
      <main style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '2rem 1rem', flex: 1 }}>
        {loading ? (
          <div style={{ color: '#ffd203', fontWeight: 700, fontSize: '1.2rem', marginTop: 32 }}>Cargando carta...</div>
        ) : error ? (
          <div style={{ color: 'red', fontWeight: 700, fontSize: '1.2rem', marginTop: 32 }}>{error}</div>
        ) : (
          Object.keys(menu).length === 0 ? (
            <div style={{ color: '#ffd203', fontWeight: 700, fontSize: '1.2rem', marginTop: 32 }}>No hay productos disponibles.</div>
          ) : (
            Object.entries(menu).map(([categoria, productos]) => (
              <section key={categoria} style={{ marginBottom: 36 }}>
                <h2 style={{ color: '#ffd203', fontWeight: 900, fontSize: 26, borderBottom: '2px solid #ffd203', paddingBottom: 6, marginBottom: 18 }}>{categoria}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                  {productos.map(prod => (
                    <div key={prod.id} style={{ background: '#181818', borderRadius: 14, boxShadow: '0 2px 12px #0008', padding: 18, minWidth: 220, maxWidth: 260, flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {prod.image_url && <img src={prod.image_url} alt={prod.name} style={{ height: 90, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />}
                      <div style={{ fontWeight: 900, fontSize: 18, color: '#ffd203', textAlign: 'center' }}>{prod.name}</div>
                      <div style={{ color: '#fff', fontSize: 15, margin: '6px 0 8px 0', textAlign: 'center' }}>{prod.description}</div>
                      <div style={{ color: '#ffd203', fontWeight: 700, fontSize: 17, marginTop: 4 }}>${prod.price}</div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )
        )}
      </main>
      <footer style={{ width: '100%', textAlign: 'center', padding: '1rem 0', background: '#010001', color: '#ffd203', fontSize: 15 }}>
        Consulta solo informativa. Precios sujetos a cambio sin previo aviso.
      </footer>
    </div>
  );
}
