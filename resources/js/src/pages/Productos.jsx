import React, { useEffect, useState, useRef } from 'react';
import echo from '../echo';
import axios from '../axiosConfig';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const dropRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Estilos globales para evitar scroll en body/html
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Cargar productos al iniciar
  // Fetch productos y suscripción realtime
  useEffect(() => {
    const fetchProductos = () => {
      axios.get('/api/productos')
        .then(res => {
          setProductos(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudo cargar la lista de productos.');
          setLoading(false);
        });
    };
    fetchProductos();
    // Suscribirse a eventos realtime
    const channel = echo.channel('products')
      .listen('ProductActualizado', (e) => {
        console.log('Evento ProductActualizado recibido', e);
        fetchProductos();
      });
    return () => {
      channel.stopListening('ProductActualizado');
    };
  }, []);

  // Crear nuevo producto
  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price || !form.category.trim()) {
      setError('Nombre, precio y categoría son obligatorios.');
      return;
    }
    if (imageError) {
      setError(imageError);
      return;
    }
    let imageUrl = form.image_url;
    // Si hay imagen seleccionada, subirla a Cloudinary
    if (imageFile) {
      setUploading(true);
      const data = new FormData();
      data.append('image', imageFile);
      try {
      const res = await axios.post('/api/cloudinary/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      imageUrl = res.data.url;
      } catch (err) {
        setError('Error de conexión al subir la imagen');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    try {
      const res = await axios.post('/api/productos', {
        name: form.name,
        description: form.description,
        price: form.price,
        image_url: imageUrl,
        category: form.category
      });
      setProductos([...productos, res.data]);
      setForm({ name: '', description: '', price: '', image_url: '', category: '' });
      setImageFile(null);
      setImagePreview('');
      setImageError('');
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  // Al hacer clic en un producto, cargar datos en el formulario para editar
  const handleEditClick = (prod) => {
    setEditId(prod.id);
    setForm({
      name: prod.name || '',
      description: prod.description || '',
      price: prod.price || '',
      image_url: prod.image_url || '',
      category: prod.category || ''
    });
    setImageFile(null);
    setImagePreview(prod.image_url || '');
    setImageError('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ name: '', description: '', price: '', image_url: '', category: '' });
    setImageFile(null);
    setImagePreview('');
    setImageError('');
    setError('');
  };

  // Guardar cambios de edición
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price || !form.category.trim()) {
      setError('Nombre, precio y categoría son obligatorios.');
      return;
    }
    if (imageError) {
      setError(imageError);
      return;
    }
    let imageUrl = form.image_url;
    if (imageFile) {
      setUploading(true);
      const data = new FormData();
      data.append('image', imageFile);
      try {
      const res = await axios.post('/api/cloudinary/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      imageUrl = res.data.url;
      } catch (err) {
        setError('Error de conexión al subir la imagen');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    try {
      const res = await axios.patch(`/api/productos/${editId}`, {
        name: form.name,
        description: form.description,
        price: form.price,
        image_url: imageUrl,
        category: form.category
      });
      setProductos(productos.map(p => p.id === editId ? res.data : p));
      handleCancelEdit();
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  // Inhabilitar o reactivar producto
  const handleToggleActivo = async (prod) => {
    try {
      const res = await axios.patch(`/api/productos/${prod.id}`, { active: !prod.active });
      setProductos(productos.map(p => p.id === prod.id ? res.data : p));
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  // Manejo de input de texto
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejo de archivo (drag, file input, portapapeles)
  const handleImage = (file) => {
    setImageError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Solo se permiten archivos de imagen.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('La imagen no debe superar los 5MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Drag & drop
  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;
    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImage(e.dataTransfer.files[0]);
      }
    };
    const handleDragOver = (e) => e.preventDefault();
    drop.addEventListener('drop', handleDrop);
    drop.addEventListener('dragover', handleDragOver);
    return () => {
      drop.removeEventListener('drop', handleDrop);
      drop.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  // Portapapeles
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
        handleImage(e.clipboardData.files[0]);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div style={{ minHeight: '100dvh', height: '100dvh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
      <div style={{ width: '100%', maxWidth: 600, flex: '0 0 auto', padding: '2rem', borderRadius: '1.2rem', background: '#222', margin: 0, boxShadow: '0 2px 16px #0006' }}>
        <h2 style={{ color: '#ffd203', marginBottom: 24 }}>Gestión de Productos</h2>
        <form onSubmit={editId ? handleUpdate : handleCrear} style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nombre" style={{ flex: 1, minWidth: 120, padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203' }} />
          <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Descripción" style={{ flex: 2, minWidth: 120, padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203' }} />
          <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Precio" min="0" step="0.01" style={{ width: 100, padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203' }} />
          <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Categoría" style={{ flex: 1, minWidth: 120, padding: '0.7rem', borderRadius: 8, border: '1px solid #ffd203' }} />
          <div ref={dropRef} style={{ flex: 2, minWidth: 120, padding: '0.7rem', border: '2px dashed #ffd203', borderRadius: 8, background: '#181818', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
            <input
              type="file"
              accept="image/*"
              style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, cursor: 'pointer' }}
              onChange={e => handleImage(e.target.files[0])}
              title="Subir imagen"
            />
            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={imagePreview} alt="Vista previa" style={{ maxHeight: 80, borderRadius: 8, margin: 4 }} />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setImageError(''); }} style={{ position: 'absolute', top: 0, right: 0, background: '#ffd203', color: '#010001', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: '18px', padding: 0 }}>×</button>
              </div>
            ) : (
              <span style={{ color: '#ffd203', fontSize: 14 }}>
                Arrastra una imagen aquí, haz click o pega desde el portapapeles
              </span>
            )}
            {imageError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{imageError}</div>}
          </div>
          <button type="submit" disabled={uploading} style={{ padding: '0.7rem 1.5rem', borderRadius: '1rem', background: uploading ? '#aaa' : '#ffd203', color: '#010001', fontWeight: 700, border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '1.1rem' }}>{uploading ? 'Subiendo imagen...' : 'Agregar'}</button>
          {editId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '0.7rem 1.5rem', borderRadius: '1rem', background: '#555', color: '#ffd203', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1.1rem', marginLeft: 8 }}>Cancelar</button>
          )}
        </form>
        {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
      </div>
      <div style={{ width: '100%', maxWidth: 600, flex: 1, overflow: 'auto', margin: 0, padding: 0, background: '#222', borderRadius: '1.2rem', boxShadow: '0 2px 16px #0006', marginTop: 16 }}>
        {loading ? (
          <p style={{ color: '#fff' }}>Cargando productos...</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {productos.length === 0 ? (
              <li style={{ color: '#fff' }}>No hay productos registrados.</li>
            ) : (
              productos.map(prod => (
                <li key={prod.id} style={{ background: prod.active ? '#333' : '#555', color: prod.active ? '#ffd203' : '#aaa', padding: '0.7rem 1.2rem', borderRadius: 8, marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div onClick={() => handleEditClick(prod)} style={{ flex: 1, minWidth: 0 }}>
                    <b>{prod.name}</b> <span style={{ fontSize: 13, color: '#fff', marginLeft: 8 }}>({prod.category}{!prod.active && ' - inhabilitado'})</span> - ${prod.price}
                    {prod.image_url && <img src={prod.image_url} alt={prod.name} style={{ height: 40, marginLeft: 12, borderRadius: 6, verticalAlign: 'middle' }} />}
                    <div style={{ fontSize: 13, color: '#fff', marginTop: 4 }}>{prod.description}</div>
                  </div>
                  <button type="button" onClick={() => handleToggleActivo(prod)} style={{ marginLeft: 12, padding: '0.4rem 1rem', borderRadius: 8, background: prod.active ? '#ffd203' : '#444', color: prod.active ? '#010001' : '#ffd203', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                    {prod.active ? 'Inhabilitar' : 'Reactivar'}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
