import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const TIPOS_PROYECTO = [
  'Relleno Sanitario',
  'Planta de transferencia',
  'Planta de tratamiento de residuos orgánicos putrescibles',
  'Plantas de selección y transformación de residuos sólidos inorgánicos',
];

const s = {
  page: { minHeight: '100vh', background: '#f0faf3', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: {
    background: '#ffffff', borderBottom: '1px solid #e8eaed',
    padding: '0 32px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', height: '64px',
    position: 'sticky', top: 0, zIndex: 100,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoCircle: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #2d9a4e, #1e7a3a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: '16px', fontWeight: '700', color: '#202124' },
  headerSubtitle: { fontSize: '11px', color: '#5f6368', marginTop: '1px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userInfo: { textAlign: 'right' },
  userName: { fontSize: '14px', fontWeight: '600', color: '#202124' },
  userRole: { fontSize: '12px', color: '#5f6368' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '8px',
    border: '1px solid #e8eaed', background: '#ffffff',
    fontSize: '13px', fontWeight: '600', color: '#5f6368', cursor: 'pointer',
  },
  nav: {
    background: '#ffffff', borderBottom: '1px solid #e8eaed',
    padding: '0 32px', display: 'flex', gap: '4px',
  },
  navBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '14px 16px', fontSize: '14px', fontWeight: '500',
    color: active ? '#2d9a4e' : '#5f6368',
    borderBottom: active ? '2px solid #2d9a4e' : '2px solid transparent',
    background: 'none', border: 'none', cursor: 'pointer', marginBottom: '-1px',
  }),
  content: { padding: '32px', maxWidth: '760px', margin: '0 auto' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', color: '#202124',
    marginBottom: '24px', padding: '0',
  },
  card: {
    background: '#ffffff', borderRadius: '16px', padding: '32px',
    border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardTitle: { fontSize: '20px', fontWeight: '700', color: '#202124', marginBottom: '6px' },
  cardSubtitle: { fontSize: '14px', color: '#5f6368', marginBottom: '28px' },
  fieldGroup: { marginBottom: '20px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#202124', marginBottom: '8px', display: 'block' },
  input: {
    width: '100%', padding: '12px 16px', background: '#f8f9fa',
    border: '1.5px solid #e8eaed', borderRadius: '10px',
    fontSize: '14px', color: '#202124', boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  },
  inputFocus: { background: '#ffffff', borderColor: '#2d9a4e', outline: 'none' },
  select: {
    width: '100%', padding: '12px 16px', background: '#ffffff',
    border: '1.5px solid #e8eaed', borderRadius: '10px',
    fontSize: '14px', color: '#202124', cursor: 'pointer',
    appearance: 'auto', boxSizing: 'border-box',
  },
  selectFocus: { borderColor: '#2d9a4e', outline: 'none' },
  infoBox: {
    background: '#eef2ff', border: '1px solid #c7d2fe',
    borderRadius: '10px', padding: '16px 20px', marginBottom: '24px',
  },
  infoTitle: { fontSize: '14px', fontWeight: '700', color: '#3730a3', marginBottom: '4px' },
  infoText: { fontSize: '13px', color: '#4338ca' },
  submitBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #2d9a4e, #1e7a3a)',
    color: '#ffffff', fontWeight: '700', fontSize: '15px',
    borderRadius: '12px', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(45,154,78,0.3)',
    transition: 'opacity 0.2s, transform 0.15s',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#fce8e6', border: '1px solid #f5c6c2',
    borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
    color: '#d93025', fontSize: '13.5px', fontWeight: '500',
  },
};

const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);
const IconDash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconEval = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
  </svg>
);
const IconSalir = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function NuevaEvaluacion() {
  const navigate = useNavigate();
  const location = useLocation();

  // Recibe el tipo de proyecto desde el Dashboard si fue seleccionado
  const tipoInicial = location.state?.tipoProyecto || 'Relleno Sanitario';

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [tipoProyecto, setTipoProyecto] = useState(tipoInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [selectFocus, setSelectFocus] = useState(false);

  const handleSalir = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!nombreProyecto.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/evaluaciones/crear`,
        { nombreProyecto, tipoProyecto },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la evaluación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        .nav-btn:hover { color: #2d9a4e !important; }
        .logout-btn:hover { background: #f8f9fa !important; }
        .submit-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .back-btn:hover { opacity: 0.7; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logoCircle}><LeafIcon /></div>
          <div>
            <div style={s.headerTitle}>Sistema de Evaluación Ambiental</div>
            <div style={s.headerSubtitle}>Gestión de proyectos sostenibles</div>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.userInfo}>
            <div style={s.userName}>{usuario.nombre || 'Usuario'}</div>
            <div style={s.userRole}>{usuario.rol || 'Sin rol'}</div>
          </div>
          <button className="logout-btn" style={s.logoutBtn} onClick={handleSalir}>
            <IconSalir /> Salir
          </button>
        </div>
      </header>

      {/* ── NAVEGACIÓN ── */}
      <nav style={s.nav}>
        <button className="nav-btn" style={s.navBtn(false)} onClick={() => navigate('/dashboard')}>
          <IconDash /> Dashboard
        </button>
        <button className="nav-btn" style={s.navBtn(true)}>
          <IconEval /> Evaluaciones
        </button>
      </nav>

      {/* ── CONTENIDO ── */}
      <main style={s.content}>
        <button className="back-btn" style={s.backBtn} onClick={() => navigate('/dashboard')}>
          <IconBack /> Volver al Dashboard
        </button>

        <div style={s.card}>
          <div style={s.cardTitle}>Nueva Evaluación de Proyecto</div>
          <div style={s.cardSubtitle}>Ingrese la información básica del proyecto a evaluar</div>

          {error && (
            <div style={s.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Nombre del Proyecto *</label>
              <input
                type="text"
                placeholder="Ej: Planta de Reciclaje Municipal"
                value={nombreProyecto}
                style={{ ...s.input, ...(inputFocus ? s.inputFocus : {}) }}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                onChange={e => setNombreProyecto(e.target.value)}
                required
              />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Tipo de Proyecto *</label>
              <select
                value={tipoProyecto}
                style={{ ...s.select, ...(selectFocus ? s.selectFocus : {}) }}
                onFocus={() => setSelectFocus(true)}
                onBlur={() => setSelectFocus(false)}
                onChange={e => setTipoProyecto(e.target.value)}
                required
              >
                {TIPOS_PROYECTO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div style={s.infoBox}>
              <div style={s.infoTitle}>Criterios a evaluar: <span>5</span></div>
              <div style={s.infoText}>Se evaluarán 5 criterios activos del sistema</div>
            </div>

            <button type="submit" className="submit-btn" style={s.submitBtn} disabled={loading}>
              {loading ? 'Guardando...' : <><span>Comenzar Evaluación</span><IconArrow /></>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}