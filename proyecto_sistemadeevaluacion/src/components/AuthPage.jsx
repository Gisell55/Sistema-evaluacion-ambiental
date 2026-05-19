import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const PAISES = [
  "Afganistán","Albania","Alemania","Andorra","Angola","Antigua y Barbuda","Arabia Saudita",
  "Argelia","Argentina","Armenia","Australia","Austria","Azerbaiyán","Bahamas","Bangladés",
  "Barbados","Baréin","Bélgica","Belice","Benín","Bielorrusia","Bolivia","Bosnia y Herzegovina",
  "Botsuana","Brasil","Brunéi","Bulgaria","Burkina Faso","Burundi","Bután","Cabo Verde",
  "Camboya","Camerún","Canadá","Catar","Chad","Chile","China","Chipre","Colombia","Comoras",
  "Corea del Norte","Corea del Sur","Costa de Marfil","Costa Rica","Croacia","Cuba","Dinamarca",
  "Dominica","Ecuador","Egipto","El Salvador","Emiratos Árabes Unidos","Eritrea","Eslovaquia",
  "Eslovenia","España","Estados Unidos","Estonia","Etiopía","Filipinas","Finlandia","Fiyi",
  "Francia","Gabón","Gambia","Georgia","Ghana","Granada","Grecia","Guatemala","Guinea",
  "Guinea-Bisáu","Guinea Ecuatorial","Guyana","Haití","Honduras","Hungría","India","Indonesia",
  "Irak","Irán","Irlanda","Islandia","Islas Marshall","Islas Salomón","Israel","Italia",
  "Jamaica","Japón","Jordania","Kazajistán","Kenia","Kirguistán","Kiribati","Kuwait","Laos",
  "Lesoto","Letonia","Líbano","Liberia","Libia","Liechtenstein","Lituania","Luxemburgo",
  "Madagascar","Malasia","Malaui","Maldivas","Mali","Malta","Marruecos","Mauricio","Mauritania",
  "México","Micronesia","Moldavia","Mónaco","Mongolia","Montenegro","Mozambique","Namibia",
  "Nauru","Nepal","Nicaragua","Níger","Nigeria","Noruega","Nueva Zelanda","Omán","Países Bajos",
  "Pakistán","Palaos","Panamá","Papúa Nueva Guinea","Paraguay","Perú","Polonia","Portugal",
  "Reino Unido","República Centroafricana","República Checa","República del Congo",
  "República Democrática del Congo","República Dominicana","Ruanda","Rumania","Rusia",
  "Samoa","San Cristóbal y Nieves","San Marino","San Vicente y las Granadinas","Santa Lucía",
  "Santo Tomé y Príncipe","Senegal","Serbia","Seychelles","Sierra Leona","Singapur","Siria",
  "Somalia","Sri Lanka","Suazilandia","Sudáfrica","Sudán","Sudán del Sur","Suecia","Suiza",
  "Surinam","Tailandia","Tanzania","Tayikistán","Timor Oriental","Togo","Tonga",
  "Trinidad y Tobago","Túnez","Turkmenistán","Turquía","Tuvalu","Ucrania","Uganda","Uruguay",
  "Uzbekistán","Vanuatu","Venezuela","Vietnam","Yemen","Yibuti","Zambia","Zimbabue"
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #d4edda 0%, #e8f5ec 50%, #c8e6c9 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px 16px',
  },
  card: {
    background: '#ffffff', borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(45,154,78,0.12), 0 2px 8px rgba(0,0,0,0.06)',
    padding: '40px 40px 36px', width: '100%', maxWidth: '560px',
    animation: 'fadeIn 0.4s ease',
  },
  header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' },
  logoCircle: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #2d9a4e, #1e7a3a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '16px', boxShadow: '0 4px 16px rgba(45,154,78,0.35)',
  },
  title: { fontSize: '22px', fontWeight: '700', color: '#202124', marginBottom: '6px', textAlign: 'center' },
  subtitle: { fontSize: '13.5px', color: '#5f6368', textAlign: 'center', lineHeight: '1.5' },
  tabContainer: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    background: '#f1f3f4', borderRadius: '12px', padding: '4px', marginBottom: '24px',
  },
  tab: (active) => ({
    padding: '10px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
    transition: 'all 0.2s ease',
    background: active ? '#ffffff' : 'transparent',
    color: active ? '#202124' : '#5f6368',
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
    cursor: 'pointer', border: 'none',
  }),
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#fce8e6', border: '1px solid #f5c6c2', borderRadius: '10px',
    padding: '12px 16px', marginBottom: '20px', color: '#d93025',
    fontSize: '13.5px', fontWeight: '500',
  },
  successBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#e6f4ea', border: '1px solid #a8d5b5', borderRadius: '10px',
    padding: '12px 16px', marginBottom: '20px', color: '#1e7a3a',
    fontSize: '13.5px', fontWeight: '500',
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  label: { fontSize: '13.5px', fontWeight: '600', color: '#202124' },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', padding: '11px 14px', background: '#f1f3f4',
    border: '1.5px solid transparent', borderRadius: '10px',
    fontSize: '14px', color: '#202124',
    transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box',
  },
  inputFocus: { background: '#ffffff', borderColor: '#2d9a4e' },
  inputPassword: { paddingRight: '44px' },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#9aa0a6',
    display: 'flex', alignItems: 'center', padding: '4px',
  },
  select: {
    width: '100%', padding: '11px 14px', background: '#f1f3f4',
    border: '1.5px solid transparent', borderRadius: '10px',
    fontSize: '14px', color: '#202124', cursor: 'pointer',
    boxSizing: 'border-box',
  },
  selectFocus: { background: '#ffffff', borderColor: '#2d9a4e', outline: 'none' },
  passwordRules: { marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' },
  rule: (ok) => ({
    fontSize: '12px', color: ok ? '#2d9a4e' : '#9aa0a6',
    display: 'flex', alignItems: 'center', gap: '5px',
    fontWeight: ok ? '600' : '400',
  }),
  submitBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #2d9a4e, #1e7a3a)',
    color: '#ffffff', fontWeight: '700', fontSize: '15px',
    borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '8px',
    boxShadow: '0 4px 16px rgba(45,154,78,0.35)',
    transition: 'opacity 0.2s, transform 0.15s', letterSpacing: '0.3px',
  },
};

const LeafIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginFocus, setLoginFocus] = useState({});

  const [regData, setRegData] = useState({
    nombre: '', email: '', password: '', confirmPassword: '',
    nacionalidad: '', ciudad: '', rol: 'Estudiante',
    empresa: '', tipoEmpresa: 'Universidad',
  });
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regFocus, setRegFocus] = useState({});

  const pwRules = [
    { label: '8-15 caracteres', ok: regData.password.length >= 8 && regData.password.length <= 15 },
    { label: 'Una mayúscula', ok: /[A-Z]/.test(regData.password) },
    { label: 'Una minúscula', ok: /[a-z]/.test(regData.password) },
    { label: 'Un número', ok: /[0-9]/.test(regData.password) },
  ];

  const switchTab = (t) => { setTab(t); setError(''); setSuccess(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, loginData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Correo electrónico o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regData.password !== regData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!pwRules.every(r => r.ok)) {
      setError('La contraseña no cumple todos los requisitos');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, regData);
      setSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      setTab('login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field, focusMap) => ({
    ...styles.input, ...(focusMap[field] ? styles.inputFocus : {}),
  });
  const selectStyle = (field, focusMap) => ({
    ...styles.select, ...(focusMap[field] ? styles.selectFocus : {}),
  });

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color: #9aa0a6; }
        button.submit:hover { opacity:0.92; transform:translateY(-1px); }
        button.submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        input:focus, select:focus { outline:none; }
      `}</style>
      <div style={styles.page} className="resp-login-page">
        <div style={styles.card} className="resp-login-card">
          <div style={styles.header}>
            <div style={styles.logoCircle}><LeafIcon /></div>
            <h1 style={styles.title}>Sistema de Evaluación Ambiental</h1>
            <p style={styles.subtitle}>Plataforma para evaluación de proyectos de sostenibilidad</p>
          </div>

          <div style={styles.tabContainer}>
           <button style={styles.tab(tab === 'login')} onClick={() => switchTab('login')}>Iniciar Sesión</button>
          <button style={styles.tab(tab === 'register')} onClick={() => switchTab('register')}>Registrarse</button>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {success && (
            <div style={styles.successBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {success}
            </div>
          )}

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Correo electrónico</label>
                <input type="email" placeholder="usuario@ejemplo.com" value={loginData.email}
                  style={inputStyle('email', loginFocus)}
                  onFocus={() => setLoginFocus(f => ({ ...f, email: true }))}
                  onBlur={() => setLoginFocus(f => ({ ...f, email: false }))}
                  onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} required />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Contraseña</label>
                <div style={styles.inputWrap}>
                  <input type={showLoginPass ? 'text' : 'password'} placeholder="Ingrese su contraseña"
                    value={loginData.password}
                    style={{ ...inputStyle('password', loginFocus), ...styles.inputPassword }}
                    onFocus={() => setLoginFocus(f => ({ ...f, password: true }))}
                    onBlur={() => setLoginFocus(f => ({ ...f, password: false }))}
                    onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))} required />
                  <button type="button" style={styles.eyeBtn} onClick={() => setShowLoginPass(v => !v)}>
                    <EyeIcon open={showLoginPass} />
                  </button>
                </div>
              </div>
                 <button type="submit" className="submit" style={styles.submitBtn} disabled={loading}>
                 {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                  <button
                     type="button"
                     onClick={() => { setError(''); setTab('recuperar'); }}
                     style={{ background: 'none', border: 'none', color: '#2d9a4e',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      marginTop: '12px', width: '100%', textAlign: 'center' }}>
                       ¿Olvidaste tu contraseña?
                  </button>
            </form>
          )}

          {/* ── REGISTRO ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>

              {/* Nombre y Email */}
              <div style={styles.grid2} className="resp-grid-2">
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Nombre completo *</label>
                  <input type="text" placeholder="Juan Pérez" value={regData.nombre}
                    style={inputStyle('nombre', regFocus)}
                    onFocus={() => setRegFocus(f => ({ ...f, nombre: true }))}
                    onBlur={() => setRegFocus(f => ({ ...f, nombre: false }))}
                    onChange={e => setRegData(d => ({ ...d, nombre: e.target.value }))} required />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Correo electrónico *</label>
                  <input type="email" placeholder="usuario@ejemplo.com" value={regData.email}
                    style={inputStyle('email', regFocus)}
                    onFocus={() => setRegFocus(f => ({ ...f, email: true }))}
                    onBlur={() => setRegFocus(f => ({ ...f, email: false }))}
                    onChange={e => setRegData(d => ({ ...d, email: e.target.value }))} required />
                </div>
              </div>

              {/* Contraseñas */}
              <div style={styles.grid2} className="resp-grid-2">
                <div style={{ ...styles.fieldGroup, marginBottom: '4px' }}>
                  <label style={styles.label}>Contraseña *</label>
                  <div style={styles.inputWrap}>
                    <input type={showRegPass ? 'text' : 'password'} placeholder="Contraseña segura"
                      value={regData.password}
                      style={{ ...inputStyle('password', regFocus), ...styles.inputPassword }}
                      onFocus={() => setRegFocus(f => ({ ...f, password: true }))}
                      onBlur={() => setRegFocus(f => ({ ...f, password: false }))}
                      onChange={e => setRegData(d => ({ ...d, password: e.target.value }))} required />
                    <button type="button" style={styles.eyeBtn} onClick={() => setShowRegPass(v => !v)}>
                      <EyeIcon open={showRegPass} />
                    </button>
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Confirmar contraseña *</label>
                  <div style={styles.inputWrap}>
                    <input type={showRegConfirm ? 'text' : 'password'} placeholder="Confirme su contraseña"
                      value={regData.confirmPassword}
                      style={{ ...inputStyle('confirm', regFocus), ...styles.inputPassword }}
                      onFocus={() => setRegFocus(f => ({ ...f, confirm: true }))}
                      onBlur={() => setRegFocus(f => ({ ...f, confirm: false }))}
                      onChange={e => setRegData(d => ({ ...d, confirmPassword: e.target.value }))} required />
                    <button type="button" style={styles.eyeBtn} onClick={() => setShowRegConfirm(v => !v)}>
                      <EyeIcon open={showRegConfirm} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reglas contraseña */}
              <div style={{ ...styles.passwordRules, marginBottom: '16px' }}>
                {pwRules.map(r => (
                  <span key={r.label} style={styles.rule(r.ok)}>
                    {r.ok ? '✓' : '○'} {r.label}
                  </span>
                ))}
              </div>

              {/* Nacionalidad y Ciudad */}
              <div style={styles.grid2} className="resp-grid-2">
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Nacionalidad *</label>
                  <select value={regData.nacionalidad}
                    style={selectStyle('nac', regFocus)}
                    onFocus={() => setRegFocus(f => ({ ...f, nac: true }))}
                    onBlur={() => setRegFocus(f => ({ ...f, nac: false }))}
                    onChange={e => setRegData(d => ({ ...d, nacionalidad: e.target.value }))} required>
                    <option value="">Seleccione un país</option>
                    {PAISES.map(pais => (
                      <option key={pais} value={pais}>{pais}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Ciudad *</label>
                  <input type="text" placeholder="Bogotá" value={regData.ciudad}
                    style={inputStyle('ciudad', regFocus)}
                    onFocus={() => setRegFocus(f => ({ ...f, ciudad: true }))}
                    onBlur={() => setRegFocus(f => ({ ...f, ciudad: false }))}
                    onChange={e => setRegData(d => ({ ...d, ciudad: e.target.value }))} required />
                </div>
              </div>

              {/* Rol y Empresa */}
              <div style={styles.grid2} className="resp-grid-2">
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Rol *</label>
                  <select value={regData.rol} style={selectStyle('rol', regFocus)}
                    onFocus={() => setRegFocus(f => ({ ...f, rol: true }))}
                    onBlur={() => setRegFocus(f => ({ ...f, rol: false }))}
                    onChange={e => setRegData(d => ({ ...d, rol: e.target.value }))} required>
                    <option>Estudiante</option>
                    <option>Docente</option>
                    <option>Investigador</option>
                    <option>Consultor</option>
                    <option>Funcionario público</option>
                    <option>Empresa privada</option>
                  </select>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Tipo de empresa *</label>
                  <select value={regData.tipoEmpresa} style={selectStyle('tipo', regFocus)}
                    onFocus={() => setRegFocus(f => ({ ...f, tipo: true }))}
                    onBlur={() => setRegFocus(f => ({ ...f, tipo: false }))}
                    onChange={e => setRegData(d => ({ ...d, tipoEmpresa: e.target.value }))} required>
                    <option>Universidad</option>
                    <option>Empresa privada</option>
                    <option>ONG</option>
                    <option>Entidad pública</option>
                    <option>Centro de investigación</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>

              {/* Nombre empresa - campo completo */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Nombre de la empresa/institución *</label>
                <input type="text" placeholder="Universidad Nacional" value={regData.empresa}
                  style={inputStyle('emp', regFocus)}
                  onFocus={() => setRegFocus(f => ({ ...f, emp: true }))}
                  onBlur={() => setRegFocus(f => ({ ...f, emp: false }))}
                  onChange={e => setRegData(d => ({ ...d, empresa: e.target.value }))} required />
              </div>

              <button type="submit" className="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </button>
            </form>
          )}
          {/* ── RECUPERACIÓN ── */}
        {tab === 'recuperar' && (
          <div>
            <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '20px', lineHeight: '1.6' }}>
              Ingresa tu correo y el administrador recibirá tu solicitud para restablecer tu contraseña.
            </p>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={loginData.email}
                style={inputStyle('email', loginFocus)}
                onFocus={() => setLoginFocus(f => ({ ...f, email: true }))}
                onBlur={() => setLoginFocus(f => ({ ...f, email: false }))}
                onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
              />
            </div>
            <button
              type="button"
              className="submit"
              style={styles.submitBtn}
              disabled={loading}
              onClick={async () => {
                if (!loginData.email) { setError('Ingresa tu correo electrónico.'); return; }
                setError(''); setLoading(true);
                try {
                  await axios.post(`${API_URL}/api/recuperacion/solicitar`, { email: loginData.email });
                  setSuccess('✅ Solicitud enviada. El administrador te enviará tu nueva contraseña al correo.');
                  setTab('login');
                } catch (err) {
                  setError(err.response?.data?.message || 'Error al enviar la solicitud.');
                } finally { setLoading(false); }
              }}>
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#5f6368',
                fontSize: '13px', cursor: 'pointer', marginTop: '12px',
                width: '100%', textAlign: 'center' }}>
              ← Volver al inicio de sesión
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}