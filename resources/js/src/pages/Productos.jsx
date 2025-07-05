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

  // Nuevo: deseleccionar producto y limpiar formulario
  const handleCancelEditFull = () => {
    setEditId(null);
    setForm({ name: '', description: '', price: '', image_url: '', category: '' });
    setImageFile(null);
    setImagePreview('');
    setImageError('');
    setError('');
  };

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
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '24px',
      boxSizing: 'border-box',
      minHeight: 0,
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: 'none',
        flexShrink: 0,
        marginBottom: '24px',
        alignSelf: 'stretch',
        paddingLeft: 0,
        paddingRight: 0
      }}>
        <h2 style={{ color: '#ffd203', marginBottom: 24 }}>Gestión de Productos</h2>
        <form
  onSubmit={editId ? handleUpdate : handleCrear}
  style={{
    marginBottom: 32,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateRows: '38px 90px 38px',
    gap: 10,
    width: '100%',
    boxSizing: 'border-box',
    alignItems: 'center',
    gridTemplateAreas: `
      'name name category price'
      'desc desc desc desc'
      'img img cancel submit'
    `,
    paddingLeft: 48,
    paddingRight: 48
  }}
>
  <input
    type="text"
    name="name"
    value={form.name}
    onChange={handleChange}
    placeholder="Nombre"
    style={{
      gridArea: 'name',
      width: '100%',
      minWidth: 120,
      padding: '0.45rem',
      borderRadius: 8,
      border: '1px solid #ffd203',
      fontSize: 15,
      height: 38,
      boxSizing: 'border-box'
    }}
  />
  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Descripción"
    rows={2}
    style={{
      gridArea: 'desc',
      width: '100%',
      minWidth: 120,
      padding: '0.45rem',
      borderRadius: 8,
      border: '1px solid #ffd203',
      resize: 'none',
      fontSize: 15,
      height: 38,
      boxSizing: 'border-box',
      marginTop: '-10px'
    }}
  />
  <input
    type="text"
    name="category"
    value={form.category}
    onChange={handleChange}
    placeholder="Categoría"
    style={{
      gridArea: 'category',
      width: '100%',
      minWidth: 120,
      padding: '0.45rem',
      borderRadius: 8,
      border: '1px solid #ffd203',
      fontSize: 15,
      height: 38,
      boxSizing: 'border-box'
    }}
  />
  <input
    type="number"
    name="price"
    value={form.price}
    onChange={handleChange}
    placeholder="Precio"
    min="0"
    step="0.01"
    style={{
      gridArea: 'price',
      width: '100%',
      minWidth: 120,
      padding: '0.45rem',
      borderRadius: 8,
      border: '1px solid #ffd203',
      fontSize: 15,
      height: 38,
      boxSizing: 'border-box'
    }}
  />
  <div
    ref={dropRef}
    style={{
      gridArea: 'img',
      width: 120,
      height: 80,
      minWidth: 120,
      minHeight: 80,
      padding: 0,
      border: '2px dashed #ffd203',
      borderRadius: 8,
      background: '#181818',
      textAlign: 'center',
      cursor: 'pointer',
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}
  >
    <input
      type="file"
      accept="image/*"
      style={{
        opacity: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        cursor: 'pointer'
      }}
      onChange={e => handleImage(e.target.files[0])}
      title="Subir imagen"
    />
    {imagePreview ? (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img src={imagePreview} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        <button
          type="button"
          onClick={() => {
            setImageFile(null);
            setImagePreview('');
            setImageError('');
          }}
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: '#ffd203',
            color: '#010001',
            border: 'none',
            borderRadius: '50%',
            width: 22,
            height: 22,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 16,
            lineHeight: '18px',
            padding: 0,
            zIndex: 2
          }}
        >
          ×
        </button>
      </div>
    ) : (
      <span style={{ color: '#ffd203', fontSize: 14 }}>
        Arrastra una imagen aquí, haz click o pega desde el portapapeles
      </span>
    )}
    {imageError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{imageError}</div>}
  </div>
  {editId && (
    <button
      type="button"
      onClick={handleCancelEditFull}
      style={{
        gridArea: 'cancel',
        padding: '0.7rem 1.5rem',
        borderRadius: '1rem',
        background: '#ffd203',
        color: '#010001',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.1rem',
        width: '100%'
      }}
    >
      Cancelar
    </button>
  )}
  <button
    type="submit"
    disabled={uploading}
    style={{
      gridArea: 'submit',
      padding: '0.7rem 1.5rem',
      borderRadius: '1rem',
      background: uploading ? '#aaa' : '#ffd203',
      color: '#010001',
      fontWeight: 700,
      border: 'none',
      cursor: uploading ? 'not-allowed' : 'pointer',
      fontSize: '1.1rem',
      width: '100%'
    }}
  >
    {uploading ? 'Subiendo imagen...' : editId ? 'Editar' : 'Agregar'}
  </button>
</form>
        {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
      </div>
      <div style={{ 
        width: '100%',
        flex: 1,
        minHeight: 0,
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        background: '#232323',
        borderRadius: '12px',
        padding: '24px',
        boxSizing: 'border-box'
      }}>
        {loading ? (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#fff' 
          }}>Cargando productos...</div>
        ) : (
          <div style={{ 
            flex: 1, 
            minHeight: 0, 
            overflowY: 'auto',
            position: 'relative',
            maxHeight: '100%',
          }}>
            {productos.length === 0 ? (
              <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>No hay productos registrados.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                <thead>
                  <tr style={{ background: '#181818', position: 'sticky', top: 0, zIndex: 2 }}>
                    <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203', background: '#181818' }}>Imagen</th>
                    <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'left', borderBottom: '2px solid #ffd203', background: '#181818' }}>Nombre</th>
                    <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'left', borderBottom: '2px solid #ffd203', background: '#181818' }}>Descripción</th>
                    <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203', background: '#181818' }}>Categoría</th>
                    <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203', background: '#181818' }}>Precio</th>
                    <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203', background: '#181818' }}>Estado</th>
                    <th style={{ color: '#ffd203', fontWeight: 800, fontSize: 15, padding: '8px', textAlign: 'center', borderBottom: '2px solid #ffd203', background: '#181818' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(prod => (
                    <tr
                      key={prod.id}
                      style={{
                        background: editId === prod.id ? '#2a2a1a' : 'transparent',
                        borderRadius: 10,
                        borderBottom: '1px solid #333',
                        transition: 'border 0.15s',
                        outline: editId === prod.id ? '2.5px solid #ffd203' : 'none',
                        border: editId === prod.id ? '2.5px solid #ffd203' : '2.5px solid transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleEditClick(prod)}
                    >
                      <td style={{ textAlign: 'center', padding: '6px' }}>
                        <img
                          src={prod.image_url ? prod.image_url : '/logo_brasas.jpg'}
                          alt={prod.name}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, background: '#333', filter: prod.image_url ? 'none' : 'grayscale(1)', opacity: prod.image_url ? 1 : 0.7 }}
                        />
                      </td>
                      <td style={{ color: '#ffd203', fontWeight: 700, fontSize: 15, padding: '6px', textAlign: 'left', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={prod.name}>
                        {prod.name}
                      </td>
                      <td style={{ color: '#fffbe7', fontWeight: 400, fontSize: 14, padding: '6px', textAlign: 'left', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={prod.description}>
                        {prod.description}
                      </td>
                      <td style={{ color: '#ffd203', fontWeight: 600, fontSize: 14, padding: '6px', textAlign: 'center' }}>{prod.category}</td>
                      <td style={{ color: '#fffbe7', fontWeight: 700, fontSize: 15, padding: '6px', textAlign: 'center' }}>S/ {Number(prod.price || 0).toFixed(2)}</td>
                      <td style={{ color: '#fffbe7', fontWeight: 700, fontSize: 14, padding: '6px', textAlign: 'center' }}>{prod.active ? 'Activo' : 'Inhabilitado'}</td>
                      <td style={{ textAlign: 'center', padding: '6px' }}>
                        <button type="button" onClick={() => handleToggleActivo(prod)} style={{ padding: '0.4rem 1rem', borderRadius: 8, background: prod.active ? '#ffd203' : '#444', color: prod.active ? '#010001' : '#ffd203', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                          {prod.active ? 'Inhabilitar' : 'Reactivar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
