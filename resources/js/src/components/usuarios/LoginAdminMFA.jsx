// components/usuarios/LoginAdminMFA.jsx
// Componente de login para admin con soporte de 2FA (MFA) usando Firebase Auth

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

const LoginAdminMFA = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [smsCode, setSmsCode] = useState('');
  const [resolver, setResolver] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const auth = getAuth(app);

  // Paso 1: Login con email y password (Firebase, luego Sanctum)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Solicitar cookie CSRF una sola vez al inicio
      await ensureSanctumCsrfCookie();
      await signInWithEmailAndPassword(auth, email, password);
      // Si login Firebase exitoso y NO requiere MFA, login Sanctum
      const usuario = await sanctumAdminLogin({ email, password });
      localStorage.setItem('usuario', JSON.stringify(usuario.user));
      setMessage('¡Login exitoso!');
    } catch (error) {
      if (error.code === 'auth/multi-factor-auth-required') {
        // MFA requerido
        const resolver = getMultiFactorResolver(auth, error);
        setResolver(resolver);
        setStep(2);
      } else if (error.response && error.response.data && error.response.data.message) {
        setMessage('Error: ' + error.response.data.message);
      } else {
        setMessage('Error: ' + (error.message || 'Error desconocido'));
      }
    }
    setLoading(false);
  };

  // Paso 2: Enviar SMS
  const handleSendSMS = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Renderizar reCAPTCHA invisible
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'login-mfa-sms-btn', {
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
      setMessage('Error: ' + err.message);
    }
    setLoading(false);
  };

  // Paso 3: Verificar código SMS y completar login (Firebase + Sanctum)
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // La cookie CSRF ya fue obtenida en el login inicial
      const cred = PhoneAuthProvider.credential(verificationId, smsCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await resolver.resolveSignIn(multiFactorAssertion);
      // Si MFA exitoso, login Sanctum
      const usuario = await sanctumAdminLogin({ email, password });
      localStorage.setItem('usuario', JSON.stringify(usuario.user));
      setMessage('¡Login exitoso!');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage('Error: ' + err.response.data.message);
      } else {
        setMessage('Error: ' + (err.message || 'Error desconocido'));
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#222', padding: 24, borderRadius: 12, color: '#ffd203' }}>
      <h2>Login Admin con 2FA</h2>
      {step === 1 && (
        <form onSubmit={handleLogin}>
          <label>Email admin:<br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <br /><br />
          <label>Contraseña:<br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <br /><br />
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#ffd203', color: '#010001', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: 10 }}>
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSendSMS}>
          <p>Se requiere verificación por SMS para este usuario.</p>
          <button id="login-mfa-sms-btn" type="submit" disabled={loading} style={{ width: '100%', background: '#ffd203', color: '#010001', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: 10 }}>
            {loading ? 'Enviando SMS...' : 'Enviar código SMS'}
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleVerifyCode}>
          <label>Código SMS recibido:<br />
            <input type="text" value={smsCode} onChange={e => setSmsCode(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <br /><br />
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#ffd203', color: '#010001', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: 10 }}>
            {loading ? 'Verificando...' : 'Completar login'}
          </button>
        </form>
      )}
      {message && <p style={{ color: '#fff', marginTop: 16 }}>{message}</p>}
    </div>
  );
};

export default LoginAdminMFA;
