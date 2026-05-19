import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { CRITERIOS_RELLENO, PARAMS_RELLENO } from '../datos/datosRellenoSanitario';
import { CRITERIOS_TRANSFERENCIA, PARAMS_TRANSFERENCIA } from '../datos/datosPlantaTransferencia';
import { CRITERIOS_ORGANICOS, PARAMS_ORGANICOS } from '../datos/datosResiduosOrganicos';
import { CRITERIOS_INORGANICOS, PARAMS_INORGANICOS } from '../datos/datosResiduosInorganicos';

/* ── Helpers ───────────────────────────────────────────────────────── */
const calcPts = (base, pct) => Math.round(base * parseFloat(pct || 0) / 100);

/* ── Íconos ─────────────────────────────────────────────────────────── */
const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);
const IconSalir = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconNext = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
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

/* ── Estilos base ─────────────────────────────────────────────────── */
const s = {
  page: { minHeight: '100vh', background: '#f0faf3', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: {
    background: '#fff', borderBottom: '1px solid #e8eaed',
    padding: '0 32px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', height: '64px',
    position: 'sticky', top: 0, zIndex: 200,
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
    border: '1px solid #e8eaed', background: '#fff',
    fontSize: '13px', fontWeight: '600', color: '#5f6368', cursor: 'pointer',
  },
  nav: {
    background: '#fff', borderBottom: '1px solid #e8eaed',
    padding: '0 32px', display: 'flex', gap: '4px',
    position: 'sticky', top: '64px', zIndex: 100,
  },
  navBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '14px 16px', fontSize: '14px', fontWeight: '500',
    color: active ? '#2d9a4e' : '#5f6368',
    borderBottom: active ? '2px solid #2d9a4e' : '2px solid transparent',
    background: 'none', border: 'none', cursor: 'pointer', marginBottom: '-1px',
  }),
  content: { padding: '28px 32px', maxWidth: '900px', margin: '0 auto' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', color: '#202124',
    marginBottom: '20px', padding: '0',
  },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#202124', marginBottom: '2px' },
  pageTipo: { fontSize: '14px', fontWeight: '600', color: '#2d9a4e', marginBottom: '24px' },

  /* Progress bar */
  progressWrap: {
    background: '#fff', border: '1px solid #e8eaed', borderRadius: '12px',
    padding: '16px 24px', marginBottom: '20px',
  },
  progressSteps: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', marginBottom: '10px' },
  stepLabel: (active, done) => ({
    fontSize: '13px', fontWeight: done || active ? '700' : '500',
    color: active ? '#2d9a4e' : done ? '#202124' : '#9aa0a6',
    cursor: done ? 'pointer' : 'default',
    padding: '0 4px',
  }),
  progressBar: { height: '6px', background: '#e8eaed', borderRadius: '4px', overflow: 'hidden' },
  progressFill: (pct) => ({
    height: '100%', width: `${pct}%`,
    background: 'linear-gradient(90deg, #2d9a4e, #1e7a3a)',
    borderRadius: '4px', transition: 'width 0.4s ease',
  }),
  progressHint: { fontSize: '11px', color: '#9aa0a6', marginTop: '6px', textAlign: 'center' },

  /* Card */
  card: {
    background: '#fff', borderRadius: '14px', padding: '28px',
    border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    marginBottom: '20px',
  },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#202124', marginBottom: '4px' },
  cardSubtitle: { fontSize: '13px', color: '#5f6368', marginBottom: '22px', lineHeight: '1.5' },

  /* Form fields */
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' },
  fieldGroup: { marginBottom: '18px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#202124', marginBottom: '7px', display: 'block' },
  input: {
    width: '100%', padding: '10px 14px', background: '#f8f9fa',
    border: '1.5px solid #e8eaed', borderRadius: '10px',
    fontSize: '14px', color: '#202124', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%', padding: '10px 14px', background: '#f8f9fa',
    border: '1.5px solid #e8eaed', borderRadius: '10px',
    fontSize: '14px', color: '#202124', boxSizing: 'border-box',
    resize: 'vertical', minHeight: '80px', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  infoBox: {
    background: '#f0faf3', border: '1px solid #a8d5b5', borderRadius: '10px',
    padding: '14px 18px', marginBottom: '0',
  },
  infoBoxTitle: { fontSize: '13px', fontWeight: '700', color: '#1e7a3a', marginBottom: '2px' },
  infoBoxText: { fontSize: '12px', color: '#2d9a4e' },

  /* Criteria table (step 2) */
  critRow: (bg, border) => ({
    display: 'grid', gridTemplateColumns: '1fr 160px 180px',
    alignItems: 'center', gap: '12px',
    background: bg, border: `1px solid ${border}`,
    borderRadius: '10px', padding: '12px 16px', marginBottom: '10px',
  }),
  critName: (color) => ({ fontSize: '14px', fontWeight: '600', color }),
  numInput: {
    padding: '8px 10px', borderRadius: '8px',
    border: '1.5px solid #e8eaed', background: '#fff',
    fontSize: '14px', fontWeight: '600', width: '100%',
    boxSizing: 'border-box', textAlign: 'center',
  },
  ptsDisplay: { fontSize: '16px', fontWeight: '800', color: '#202124', textAlign: 'right' },
  totalRow: {
    display: 'grid', gridTemplateColumns: '1fr 160px 180px',
    alignItems: 'center', gap: '12px',
    borderTop: '2px solid #e8eaed', paddingTop: '12px', marginTop: '4px',
  },
  sumOk: { fontSize: '13px', fontWeight: '700', color: '#2d9a4e', display: 'flex', alignItems: 'center', gap: '5px' },
  sumErr: { fontSize: '13px', fontWeight: '700', color: '#e07b00', display: 'flex', alignItems: 'center', gap: '5px' },

  /* Params step 3 */
  criterioCard: (bg, border) => ({
    background: bg, border: `1.5px solid ${border}`,
    borderRadius: '14px', padding: '20px', marginBottom: '20px',
  }),
  criterioHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  criterioTitleText: (color) => ({ fontSize: '17px', fontWeight: '800', color }),
  criterioSubtitle: (color) => ({ fontSize: '12px', fontWeight: '600', color, marginTop: '2px' }),
  addParamBtn: (btnColor) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '8px',
    background: btnColor, color: '#fff',
    fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer',
  }),
  paramBlock: {
    background: '#fff', borderRadius: '10px',
    border: '1px solid #e8eaed', marginBottom: '12px', overflow: 'hidden',
  },
  paramHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', background: '#f8f9fa', borderBottom: '1px solid #e8eaed',
  },
  paramNameInput: {
    flex: 1, border: 'none', background: 'transparent',
    fontSize: '14px', fontWeight: '600', color: '#202124',
    outline: 'none', marginRight: '12px',
  },
  paramActions: { display: 'flex', alignItems: 'center', gap: '8px' },
  addSubBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '5px 10px', borderRadius: '6px',
    background: '#e8f5ec', color: '#2d9a4e',
    fontSize: '12px', fontWeight: '700', border: 'none', cursor: 'pointer',
  },
  deleteBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '28px', height: '28px', borderRadius: '6px',
    background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer',
  },
  subTable: { width: '100%', borderCollapse: 'collapse' },
  subTh: {
    fontSize: '11px', fontWeight: '700', color: '#9aa0a6',
    padding: '8px 14px', textAlign: 'left', borderBottom: '1px solid #f1f3f4',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  subTd: { padding: '8px 14px', borderBottom: '1px solid #f1f3f4', verticalAlign: 'middle' },
subNameInput: {
    width: '100%', border: 'none', background: 'transparent',
    fontSize: '13px', color: '#202124', outline: 'none',
    whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.5',
  },
  subPctInput: {
    width: '100px', padding: '5px 8px', borderRadius: '6px',
    border: '1.5px solid #e8eaed', background: '#fff',
    fontSize: '13px', fontWeight: '600', textAlign: 'center',
  },
  subPts: { fontSize: '14px', fontWeight: '800', color: '#202124', minWidth: '60px' },
  paramTotal: { fontSize: '12px', fontWeight: '600', color: '#5f6368', padding: '8px 14px' },
  criterioSumOk: {
    background: '#f0faf3', border: '1px solid #a8d5b5',
    borderRadius: '8px', padding: '8px 14px', marginTop: '8px',
    fontSize: '13px', fontWeight: '700', color: '#2d9a4e',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  criterioSumErr: {
    background: '#fff7ed', border: '1px solid #fdba74',
    borderRadius: '8px', padding: '8px 14px', marginTop: '8px',
    fontSize: '13px', fontWeight: '600', color: '#c2410c',
    display: 'flex', alignItems: 'center', gap: '6px',
  },

  /* Nav buttons */
  navBtns: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  btnSecondary: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '11px 20px', borderRadius: '10px',
    border: '1.5px solid #e8eaed', background: '#fff',
    fontSize: '14px', fontWeight: '700', color: '#5f6368', cursor: 'pointer',
  },
  btnPrimary: (color) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '11px 24px', borderRadius: '10px',
    background: color || 'linear-gradient(135deg,#2d9a4e,#1e7a3a)',
    color: '#fff', fontSize: '14px', fontWeight: '700',
    border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(45,154,78,0.3)',
  }),
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#fff7ed', border: '1px solid #fdba74',
    borderRadius: '10px', padding: '12px 16px', marginTop: '12px',
    color: '#c2410c', fontSize: '13px', fontWeight: '600',
  },
};

/* ══════════════════════════════════════════════════════════════════ */
export default function CrearEvaluacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const tipoProyecto = location.state?.tipoProyecto || 'Relleno Sanitario';
  const getDatosPorTipo = (tipo) => {
  if (tipo === 'Planta de transferencia')
    return { criterios: CRITERIOS_TRANSFERENCIA, params: PARAMS_TRANSFERENCIA };
  if (tipo === 'Planta de tratamiento de residuos orgánicos putrescibles')
    return { criterios: CRITERIOS_ORGANICOS, params: PARAMS_ORGANICOS };
  if (tipo === 'Plantas de selección y transformación de residuos sólidos inorgánicos')
    return { criterios: CRITERIOS_INORGANICOS, params: PARAMS_INORGANICOS };
  return { criterios: CRITERIOS_RELLENO, params: PARAMS_RELLENO };
};
const datosTipo = getDatosPorTipo(tipoProyecto);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guardadoOk, setGuardadoOk] = useState(false);

  /* Step 1 state */
  const [info, setInfo] = useState({
    nombre: '', descripcion: '', ubicacion: '',
    responsable1: '', responsable2: '', baseCalculo: 1000,
  });

  /* Step 2 - criterios */
  const [criterios, setCriterios] = useState(
  datosTipo.criterios.map(c => ({ ...c, puntos: calcPts(1000, c.pct) }))
  );

  /* Step 3 - parametros */
  const [paramsData, setParamsData] = useState(
datosTipo.params.map(paramList =>
      paramList.map(p => ({
        nombre: p.nombre,
        subs: p.subs.map(s => ({ nombre: s.nombre, pct: s.pct })),
      }))
    )
  );

  /* ── Derived ── */
  const totalPct = criterios.reduce((s, c) => s + parseFloat(c.pct || 0), 0);
  const step2Ok = Math.abs(totalPct - 100) < 0.1;

  const getCriterioSubTotal = (ci) =>
    paramsData[ci].reduce((sum, p) =>
      sum + p.subs.reduce((s2, sub) => s2 + calcPts(criterios[ci].puntos, sub.pct), 0), 0);

  const step3Ok = criterios.every((c, i) => Math.abs(getCriterioSubTotal(i) - c.puntos) <= 1);

  /* ── Handlers Step 1 ── */
  const updateBase = (val) => {
    const base = parseInt(val) || 1000;
    setInfo(prev => ({ ...prev, baseCalculo: base }));
    setCriterios(prev => prev.map(c => ({ ...c, puntos: calcPts(base, c.pct) })));
  };

  /* ── Handlers Step 2 ── */
  const updateCritPct = (idx, val) => {
    const p = val;
    setCriterios(prev => prev.map((c, i) =>
      i !== idx ? c : { ...c, pct: p, puntos: calcPts(info.baseCalculo, p) }
    ));
  };

  /* ── Handlers Step 3 ── */
  const addParam = (ci) => setParamsData(prev => prev.map((params, i) =>
    i !== ci ? params : [...params, { nombre: 'Nuevo parámetro', subs: [{ nombre: 'Nuevo subparámetro', pct: 0 }] }]
  ));

  const deleteParam = (ci, pi) => setParamsData(prev => prev.map((params, i) =>
    i !== ci ? params : params.filter((_, j) => j !== pi)
  ));

  const addSub = (ci, pi) => setParamsData(prev => prev.map((params, i) =>
    i !== ci ? params : params.map((p, j) =>
      j !== pi ? p : { ...p, subs: [...p.subs, { nombre: 'Nuevo subparámetro', pct: 0 }] }
    )
  ));

  const deleteSub = (ci, pi, si) => setParamsData(prev => prev.map((params, i) =>
    i !== ci ? params : params.map((p, j) =>
      j !== pi ? p : { ...p, subs: p.subs.filter((_, k) => k !== si) }
    )
  ));

  const updateSubPct = (ci, pi, si, val) => setParamsData(prev => prev.map((params, i) =>
    i !== ci ? params : params.map((p, j) =>
      j !== pi ? p : { ...p, subs: p.subs.map((s, k) => k !== si ? s : { ...s, pct: val }) }
    )
  ));

  const updateParamNombre = (ci, pi, val) => setParamsData(prev => prev.map((params, i) =>
    i !== ci ? params : params.map((p, j) => j !== pi ? p : { ...p, nombre: val })
  ));

  const updateSubNombre = (ci, pi, si, val) => setParamsData(prev => prev.map((params, i) =>
    i !== ci ? params : params.map((p, j) =>
      j !== pi ? p : { ...p, subs: p.subs.map((s, k) => k !== si ? s : { ...s, nombre: val }) }
    )
  ));

  /* ── Navigation ── */
  const irSiguiente = () => {
    setError('');
    if (paso === 1) {
      if (!info.nombre.trim() || !info.descripcion.trim() || !info.ubicacion.trim() || !info.responsable1.trim()) {
        setError('Complete todos los campos obligatorios (*)');
        return;
      }
      setPaso(2);
    } else if (paso === 2) {
      if (!step2Ok) {
        setError(`La suma de porcentajes debe ser 100%. Actual: ${totalPct.toFixed(2)}%`);
        return;
      }
      setPaso(3);
    }
  };

  const irAnterior = () => { setError(''); setPaso(p => p - 1); };

  /* ── Save ── */
  const guardar = async () => {
    if (!step3Ok) {
      setError('Revise que todos los criterios tengan la suma correcta de parámetros antes de guardar.');
      return;
    }
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/crear-evaluacion/guardar`, {
        tipoProyecto,
        nombreProyecto: info.nombre,
        descripcion: info.descripcion,
        ubicacion: info.ubicacion,
        responsables: `${info.responsable1}${info.responsable2 ? ', ' + info.responsable2 : ''}`,
        baseCalculo: info.baseCalculo,
        criterios: criterios.map((c, ci) => ({
          nombre: c.nombre,
          porcentaje: c.pct,
          puntos: c.puntos,
          parametros: paramsData[ci].map(p => ({
            nombre: p.nombre,
            subparametros: p.subs.map(s => ({
              nombre: s.nombre,
              porcentaje: parseFloat(s.pct || 0),
              puntos: calcPts(c.puntos, s.pct),
            })),
          })),
        })),
      }, { headers: { Authorization: `Bearer ${token}` } });

      setGuardadoOk(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la evaluación');
    } finally { setLoading(false); }
  };

  const handleSalir = () => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/'); };

  const progressPct = paso === 1 ? 16 : paso === 2 ? 50 : 100;

  /* ════════════════════════════════════════════════════════════════ */
  return (
    <div style={s.page}>
      <style>{`
        .ce-input:focus { border-color: #2d9a4e !important; background: #fff !important; outline: none; }
        .ce-btn-sec:hover { background: #f8f9fa !important; }
        .ce-btn-pri:hover { opacity: 0.9; transform: translateY(-1px); }
        .ce-add-param:hover { opacity: 0.85; }
        .ce-add-sub:hover { background: #dcfce7 !important; }
        .ce-del:hover { background: #fca5a5 !important; }
        .ce-num::-webkit-inner-spin-button, .ce-num::-webkit-outer-spin-button { opacity: 1; }
        .ce-logout:hover { background: #f8f9fa !important; }
        .ce-back:hover { opacity: 0.7; }
      `}</style>

      {/* HEADER */}
      <header style={s.header} className="r-header">
        <div style={s.headerLeft}>
          <div style={s.logoCircle}><LeafIcon /></div>
          <div>
            <div style={s.headerTitle} className="resp-header-title">Sistema de Evaluación Ambiental</div>
            <div style={s.headerSubtitle} className="resp-header-subtitle">Gestión de proyectos sostenibles</div>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.userInfo}>
            <div style={s.userName}>{usuario.nombre || 'Usuario'}</div>
            <div style={s.userRole}>{usuario.rol || 'Sin rol'}</div>
          </div>
          <button className="ce-logout" style={s.logoutBtn} onClick={handleSalir}><IconSalir /> Salir</button>
        </div>
      </header>

      {/* NAV */}
      <nav style={s.nav} className="resp-nav">
        <button style={s.navBtn(false)} onClick={() => navigate('/dashboard')}><IconDash /> Dashboard</button>
        <button style={s.navBtn(true)}><IconEval /> Evaluaciones</button>
      </nav>

      {/* CONTENT */}
      <main style={s.content} className="resp-content">
        <button className="ce-back resp-back-btn" style={s.backBtn} onClick={() => navigate('/modulo', { state: { tipoProyecto } })}>
          <IconBack /> Volver al Módulo
        </button>

        <div style={s.pageTitle} className="resp-page-title">Crear Evaluación</div>
        <div style={s.pageTipo}>{tipoProyecto}</div>

        {/* PROGRESS BAR */}
        <div style={s.progressWrap}>
          <div style={s.progressSteps} className="r-progress-steps">
            {['1. Información del Proyecto', '2. Criterios', '3. Parámetros'].map((label, i) => (
              <span key={i}
                style={s.stepLabel(paso === i + 1, paso > i + 1)}
                onClick={() => paso > i + 1 && setPaso(i + 1)}
              >
                {label}
              </span>
            ))}
          </div>
          <div style={s.progressBar}><div style={s.progressFill(progressPct)} /></div>
          {paso > 1 && <div style={s.progressHint}>💡 Si desea devolverse a un paso anterior, dé clic sobre el paso</div>}
        </div>

        {/* ══ PASO 1: Información del Proyecto ══ */}
        {paso === 1 && (
          <div style={s.card} className="resp-card">
            <div style={s.cardTitle}>Paso 1: Información del Proyecto</div>
            <div style={s.cardSubtitle}>Complete los datos básicos del proyecto a evaluar</div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Nombre del Proyecto *</label>
              <input className="ce-input" style={s.input} placeholder="Nombre del proyecto"
                value={info.nombre} onChange={e => setInfo(p => ({ ...p, nombre: e.target.value }))} />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Descripción del Proyecto *</label>
              <textarea className="ce-input" style={s.textarea} placeholder="Descripción detallada del proyecto..."
                value={info.descripcion} onChange={e => setInfo(p => ({ ...p, descripcion: e.target.value }))} />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Ubicación *</label>
              <input className="ce-input" style={s.input} placeholder="Ciudad, municipio o región"
                value={info.ubicacion} onChange={e => setInfo(p => ({ ...p, ubicacion: e.target.value }))} />
            </div>

            <div style={s.grid2} className="resp-grid-2">
              <div style={s.fieldGroup}>
                <label style={s.label}>Responsable 1 *</label>
                <input className="ce-input" style={s.input} placeholder="Nombre completo"
                  value={info.responsable1} onChange={e => setInfo(p => ({ ...p, responsable1: e.target.value }))} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Responsable 2 <span style={{color:'#9aa0a6',fontWeight:400}}>(opcional)</span></label>
                <input className="ce-input" style={s.input} placeholder="Nombre completo (opcional)"
                  value={info.responsable2} onChange={e => setInfo(p => ({ ...p, responsable2: e.target.value }))} />
              </div>
            </div>

            <div style={{ ...s.infoBox, marginTop: '4px' }}>
              <div style={s.infoBoxTitle}>Valor Total de la Base de Cálculo (Puntos)</div>
              <input className="ce-input ce-num" type="number" min="100" max="10000" step="10"
                style={{ ...s.input, width: '140px', marginTop: '8px', fontWeight: '700', fontSize: '16px' }}
                value={info.baseCalculo}
                onChange={e => updateBase(e.target.value)} />
              <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '6px' }}>
                Este valor representa el puntaje máximo de la evaluación. Por defecto: 1,000 puntos
              </div>
            </div>

            {error && <div style={s.errorBox}><span>⚠</span>{error}</div>}
            <div style={{ ...s.navBtns, marginTop: '20px' }} className="resp-nav-btns">
              <div />
              <button className="ce-btn-pri" style={s.btnPrimary()} onClick={irSiguiente}>
                Siguiente: Criterios <IconNext />
              </button>
            </div>
          </div>
        )}

        {/* ══ PASO 2: Criterios ══ */}
        {paso === 2 && (
          <div style={s.card} className="resp-card">
            <div style={s.cardTitle}>Paso 2: Criterios de Evaluación</div>
            <div style={s.cardSubtitle}>
              Configure los criterios y sus puntuaciones. Escriba en cada casilla el porcentaje que desea,
              no debe sobrepasar el 100% del valor total ingresado anteriormente.
            </div>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 180px', gap: '12px',
              padding: '0 16px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Criterio</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase', textAlign: 'center' }}>Porcentaje (%)</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase', textAlign: 'right' }}>Puntuación Calculada</span>
            </div>

            {criterios.map((c, i) => (
              <div key={i} style={s.critRow(c.bg, c.border)} className="r-crit-row">
                <span style={s.critName(c.text)}>{c.nombre}</span>
                <input
                  className="ce-num"
                  type="number" min="0" max="100" step="0.01"
                  style={s.numInput}
                  value={c.pct}
                  onChange={e => updateCritPct(i, e.target.value)}
                />
                <div style={s.ptsDisplay}><strong>{c.puntos}</strong> pts</div>
              </div>
            ))}

            <div style={s.totalRow}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#202124' }}>Total:</span>
              <div style={step2Ok ? s.sumOk : s.sumErr}>
                {step2Ok ? '✓' : '⚠'} {totalPct.toFixed(2)}% = {criterios.reduce((s, c) => s + c.puntos, 0)} puntos
              </div>
              <div style={{ textAlign: 'right', fontSize: '13px', color: step2Ok ? '#2d9a4e' : '#c2410c', fontWeight: '700' }}>
                {step2Ok ? '✓ Suma correcta' : `Faltan ${(100 - totalPct).toFixed(2)}%`}
              </div>
            </div>

            {error && <div style={s.errorBox}><span>⚠</span>{error}</div>}
            <div style={{ ...s.navBtns, marginTop: '20px' }} className="resp-nav-btns">
              <button className="ce-btn-sec" style={s.btnSecondary} onClick={irAnterior}><IconBack /> Anterior</button>
              <button className="ce-btn-pri" style={s.btnPrimary()} onClick={irSiguiente}>
                Siguiente: Parámetros <IconNext />
              </button>
            </div>
          </div>
        )}

        {/* ══ PASO 3: Parámetros ══ */}
        {paso === 3 && (
          <>
            <div style={s.card} className="resp-card">
              <div style={s.cardTitle}>Paso 3: Parámetros y Subparámetros</div>
              <div style={{ ...s.cardSubtitle, marginBottom: '0' }}>
                Configure los parámetros para cada criterio. Asegúrese de editar el porcentaje de los subparámetros
                y que la suma de los subparámetros sea igual al puntaje del criterio.
              </div>
            </div>

            {criterios.map((c, ci) => {
              const subTotal = getCriterioSubTotal(ci);
              const sumOk = Math.abs(subTotal - c.puntos) <= 1;
              return (
                <div key={ci} style={s.criterioCard(c.bg, c.border)}>
                  <div style={s.criterioHeader}>
                    <div>
                      <div style={s.criterioTitleText(c.text)}>{c.nombre}</div>
                      <div style={s.criterioSubtitle(c.btnColor)}>Puntos disponibles: {c.puntos}</div>
                    </div>
                    <button className="ce-add-param" style={s.addParamBtn(c.btnColor)} onClick={() => addParam(ci)}>
                      + Agregar Parámetro
                    </button>
                  </div>

                  {paramsData[ci].map((param, pi) => {
                    const paramTotal = param.subs.reduce((s, sub) => s + calcPts(c.puntos, sub.pct), 0);
                    return (
                      <div key={pi} style={s.paramBlock}>
                        <div style={s.paramHeader}>
                          <input
                            style={s.paramNameInput}
                            value={param.nombre}
                            onChange={e => updateParamNombre(ci, pi, e.target.value)}
                          />
                          <div style={s.paramActions}>
                            <button className="ce-add-sub" style={s.addSubBtn} onClick={() => addSub(ci, pi)}>
                              + Subparámetro
                            </button>
                            <button className="ce-del" style={s.deleteBtn} onClick={() => deleteParam(ci, pi)}>
                              <IconTrash />
                            </button>
                          </div>
                        </div>

                        <table style={{...s.subTable, minWidth: '500px', display: 'block', overflowX: 'auto'}}>
                          <thead>
                            <tr>
                              <th style={s.subTh}>Nombre del Subparámetro</th>
                              <th style={{ ...s.subTh, width: '140px', textAlign: 'center' }}>Escriba el Porcentaje</th>
                              <th style={{ ...s.subTh, width: '90px', textAlign: 'center' }}>Puntos</th>
                              <th style={{ ...s.subTh, width: '40px' }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {param.subs.map((sub, si) => {
                              const pts = calcPts(c.puntos, sub.pct);
                              return (
                                <tr key={si}>
                                  <td style={s.subTd}>
                                     <div
                                       style={s.subNameInput}
                                       contentEditable
                                       suppressContentEditableWarning
                                       onBlur={e => updateSubNombre(ci, pi, si, e.currentTarget.textContent)}
                                     >
                                        {sub.nombre}
                                     </div>
                                  </td>
                                  <td style={{ ...s.subTd, textAlign: 'center' }}>
                                    <input
                                      className="ce-num"
                                      type="number" min="0" max="100" step="0.01"
                                      style={s.subPctInput}
                                      value={sub.pct}
                                      onChange={e => updateSubPct(ci, pi, si, e.target.value)}
                                    />
                                  </td>
                                  <td style={{ ...s.subTd, textAlign: 'center' }}>
                                    <span style={s.subPts}>{pts} pts</span>
                                  </td>
                                  <td style={s.subTd}>
                                    <button className="ce-del" style={s.deleteBtn} onClick={() => deleteSub(ci, pi, si)}>
                                      <IconTrash />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div style={s.paramTotal}>Total parámetro: {paramTotal} pts</div>
                      </div>);
                  })}

                  <div style={sumOk ? s.criterioSumOk : s.criterioSumErr}>
                    {sumOk
                      ? <>✓ Suma correcta para este criterio</>
                      : <>⊙ La suma de parámetros debe ser {c.puntos} pts (actual: {subTotal} pts)</>
                    }
                  </div>
                </div>
              );
            })}

            {error && <div style={s.errorBox}><span>⚠</span> {error}</div>}

            <div style={{ ...s.card, ...s.navBtns }} className="resp-nav-btns resp-card">
              <button className="ce-btn-sec" style={s.btnSecondary} onClick={irAnterior}><IconBack /> Anterior</button>
              <button
                className="ce-btn-pri"
                style={{ ...s.btnPrimary(), opacity: loading ? 0.7 : 1 }}
                onClick={guardar}
                disabled={loading}
              >
                <IconSave /> {loading ? 'Guardando...' : 'Guardar Evaluación'}
              </button>
            </div>
          </>
        )}
      </main>
      {/* ── Modal de éxito ── */}
      {guardadoOk && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:999,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'#fff', borderRadius:'20px', padding:'40px 36px', maxWidth:'480px',
            width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width:'72px', height:'72px', borderRadius:'50%',
              background:'linear-gradient(135deg,#2d9a4e,#1e7a3a)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 20px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ fontSize:'22px', fontWeight:'800', color:'#202124', marginBottom:'12px' }}>
              ¡Evaluación creada exitosamente!
            </div>
            <div style={{ fontSize:'14px', color:'#5f6368', lineHeight:'1.7', marginBottom:'28px' }}>
              El proyecto <strong>"{info.nombre}"</strong> ha sido registrado correctamente.
              <br /><br />
              Para realizar la evaluación del proyecto, diríjase al módulo{' '}
              <strong style={{color:'#2d9a4e'}}>"Evaluar"</strong> donde encontrará
              el proyecto disponible con los subparámetros para calificar.
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <button
                onClick={() => navigate('/evaluar-proyectos', { state: { tipoProyecto } })}
                style={{ width:'100%', padding:'13px', borderRadius:'12px',
                  background:'linear-gradient(135deg,#2d9a4e,#1e7a3a)', color:'#fff',
                  fontWeight:'700', fontSize:'15px', border:'none', cursor:'pointer',
                  boxShadow:'0 4px 16px rgba(45,154,78,0.35)' }}>
                Ir al Módulo Evaluar →
              </button>
              <button
                onClick={() => navigate('/modulo', { state: { tipoProyecto } })}
                style={{ width:'100%', padding:'12px', borderRadius:'12px',
                  border:'1.5px solid #e8eaed', background:'#fff',
                  fontSize:'14px', fontWeight:'600', color:'#5f6368', cursor:'pointer' }}>
                Volver al Módulo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}