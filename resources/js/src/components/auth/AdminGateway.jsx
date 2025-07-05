// components/auth/AdminGateway.jsx
// Pantalla de autenticación del administrador (primera barrera de seguridad)

import React, { useState } from 'react';
import app from '../../helpers/firebaseConfig';
import { sanctumAdminLogin, ensureSanctumCsrfCookie } from '../../helpers/sanctumLogin';
import {
  getAuth,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier
} from 'firebase/auth';

const AdminGateway = ({ onAdminAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [smsCode, setSmsCode] = useState('');
  const [resolver, setResolver] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = getAuth(app);

  // Paso 1: Login con email y password (Firebase, luego Sanctum)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Solicitar cookie CSRF una sola vez al inicio
      await ensureSanctumCsrfCookie();
      await signInWithEmailAndPassword(auth, email, password);
      
      // Si login Firebase exitoso y NO requiere MFA, login Sanctum
      const usuario = await sanctumAdminLogin({ email, password });
      
      // Marcar como admin autenticado en este navegador
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      
      // Notificar que el admin se autenticó correctamente
      onAdminAuthenticated();
      
    } catch (error) {
      if (error.code === 'auth/multi-factor-auth-required') {
        // MFA requerido
        const resolver = getMultiFactorResolver(auth, error);
        setResolver(resolver);
        setStep(2);
      } else if (error.response && error.response.data && error.response.data.message) {
        setError('Error: ' + error.response.data.message);
      } else {
        setError('Credenciales incorrectas o error de conexión');
      }
    }
    setLoading(false);
  };

  // Paso 2: Enviar SMS
  const handleSendSMS = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Renderizar reCAPTCHA invisible
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'admin-sms-btn', {
        size: 'invisible',
        callback: () => {}
      });
      
      const phoneInfoOptions = {
        multiFactorHint: resolver.hints[0],
        session: resolver.session
      };
      
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.recaptchaVerifier);
      setVerificationId(verificationId);
      setStep(3);
      
    } catch (err) {
      setError('Error al enviar SMS: ' + err.message);
    }
    setLoading(false);
  };

  // Paso 3: Verificar código SMS y completar login (Firebase + Sanctum)
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // La cookie CSRF ya fue obtenida en el login inicial
      const cred = PhoneAuthProvider.credential(verificationId, smsCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await resolver.resolveSignIn(multiFactorAssertion);
      
      // Si MFA exitoso, login Sanctum
      const usuario = await sanctumAdminLogin({ email, password });
      
      // Marcar como admin autenticado en este navegador
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      
      // Notificar que el admin se autenticó correctamente
      onAdminAuthenticated();
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Error: ' + err.response.data.message);
      } else {
        setError('Código SMS incorrecto');
      }
    }
    setLoading(false);
  };

  return (
    <div className="bienvenida-brasas">
      <div className="login-logo-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <img
          src="/logo_brasas.jpg"
          alt="Logo D'Brasas y Carbón"
          style={{ width: 110, height: 110, objectFit: 'contain', borderRadius: '50%', boxShadow: '0 2px 16px 0 #ffd20355', background: '#232323', marginBottom: 12 }}
          draggable="false"
        />
        <h1 style={{ color: '#ffd203', fontFamily: 'inherit', fontWeight: 900, fontSize: '2.1rem', margin: 0, letterSpacing: 1 }}>D'Brasas y Carbón</h1>
        <span style={{ color: '#fffbe7', fontSize: '1.1rem', fontWeight: 500, marginTop: 2, fontStyle: 'italic', letterSpacing: 0.5 }}>El sabor auténtico a la brasa</span>
      </div>

      <div style={{ maxWidth: 380, margin: '0 auto', background: '#1a1a1a', padding: 20, borderRadius: 12, border: '1px solid #ffd20330' }}>
        <h2 style={{ color: '#ffd203', textAlign: 'center', marginBottom: 16, fontSize: '1.4rem' }}>Autenticación de Administrador</h2>
        <p style={{ color: '#ccc', textAlign: 'center', marginBottom: 20, fontSize: '0.9rem' }}>
          Por seguridad, debe autenticarse como administrador en este dispositivo
        </p>

        {step === 1 && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: '#fff', display: 'block', marginBottom: 6, fontSize: '0.9rem' }}>Email del administrador:</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: 6, 
                  border: '1px solid #ffd20350', 
                  background: '#222', 
                  color: '#fff',
                  fontSize: '0.95rem'
                }} 
                placeholder="admin@email.com"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#fff', display: 'block', marginBottom: 6, fontSize: '0.9rem' }}>Contraseña:</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: 6, 
                  border: '1px solid #ffd20350', 
                  background: '#222', 
                  color: '#fff',
                  fontSize: '0.95rem'
                }} 
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                background: '#ffd203', 
                color: '#010001', 
                fontWeight: 'bold', 
                border: 'none', 
                borderRadius: 6, 
                padding: '10px 14px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Verificando...' : 'Autenticar Administrador'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <p style={{ color: '#fff', marginBottom: 16, textAlign: 'center', fontSize: '0.9rem' }}>
              Se requiere verificación por SMS para este usuario.
            </p>
            <button 
              id="admin-sms-btn"
              onClick={handleSendSMS}
              disabled={loading} 
              style={{ 
                width: '100%', 
                background: '#ffd203', 
                color: '#010001', 
                fontWeight: 'bold', 
                border: 'none', 
                borderRadius: 6, 
                padding: '10px 14px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Enviando SMS...' : 'Enviar código SMS'}
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#fff', display: 'block', marginBottom: 6, fontSize: '0.9rem' }}>Código SMS recibido:</label>
              <input 
                type="text" 
                value={smsCode} 
                onChange={e => setSmsCode(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: 6, 
                  border: '1px solid #ffd20350', 
                  background: '#222', 
                  color: '#fff',
                  fontSize: '0.95rem',
                  textAlign: 'center'
                }} 
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                background: '#ffd203', 
                color: '#010001', 
                fontWeight: 'bold', 
                border: 'none', 
                borderRadius: 6, 
                padding: '10px 14px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Verificando...' : 'Completar autenticación'}
            </button>
          </form>
        )}

        {error && (
          <p style={{ color: '#ff4444', marginTop: 14, textAlign: 'center', fontSize: '0.85rem' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminGateway;
