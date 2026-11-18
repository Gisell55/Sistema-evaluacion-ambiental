import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


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
const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconCrear = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
  </svg>
);
const IconEvaluar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d9a4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconInformes = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e07b00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
  </svg>
);

const s = {
  page: { minHeight: '100vh', background: '#f0faf3', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: {
    background: '#ffffff', borderBottom: '1px solid #e8eaed',
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
    border: '1px solid #e8eaed', background: '#ffffff',
    fontSize: '13px', fontWeight: '600', color: '#5f6368', cursor: 'pointer',
  },
  nav: {
    background: '#ffffff', borderBottom: '1px solid #e8eaed',
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
  content: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', color: '#202124',
    marginBottom: '24px', padding: '0',
  },
  heroBanner: {
    background: 'linear-gradient(135deg, #2d9a4e, #1e7a3a)',
    borderRadius: '16px', padding: '32px 36px', marginBottom: '28px',
  },
  heroTitle: { fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' },
  heroSubtitle: { fontSize: '15px', color: 'rgba(255,255,255,0.85)' },
  opcionesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' },
  opcionCard: (color) => ({
    background: color.bg, border: `1.5px solid ${color.border}`,
    borderRadius: '16px', padding: '28px 24px',
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.15s, box-shadow 0.15s',
  }),
  iconCircle: (color) => ({
    width: '52px', height: '52px', borderRadius: '14px',
    background: color.iconBg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '16px',
  }),
  opcionTitle: { fontSize: '16px', fontWeight: '700', color: '#202124', marginBottom: '8px' },
  opcionDesc: { fontSize: '13px', color: '#5f6368', lineHeight: '1.6', marginBottom: '24px', flex: 1 },
  opcionBtn: (color) => ({
    width: '100%', padding: '12px',
    background: color.btn, color: '#ffffff',
    fontWeight: '700', fontSize: '14px',
    borderRadius: '10px', border: 'none', cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
  }),
  infoCard: {
    background: '#ffffff', borderRadius: '14px', padding: '28px 32px',
    border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  infoTitle: { fontSize: '17px', fontWeight: '700', color: '#202124', marginBottom: '16px' },
  infoItem: { marginBottom: '12px', fontSize: '14px', lineHeight: '1.7', color: '#5f6368' },
  infoBold: { fontWeight: '700', color: '#202124' },
};

const OPCIONES = [
  {
    key: 'crear',
    titulo: 'Crear Evaluación',
    descripcion: 'Registrar un nuevo proyecto para evaluar',
    icono: <IconCrear />,
    color: { bg: '#eef2ff', border: '#c7d2fe', iconBg: '#e0e7ff', btn: '#3b5bdb' },
  },
  {
    key: 'evaluar',
    titulo: 'Evaluar',
    descripcion: 'Realizar la evaluación de un proyecto registrado',
    icono: <IconEvaluar />,
    color: { bg: '#f0faf3', border: '#a8d5b5', iconBg: '#dcfce7', btn: '#2d9a4e' },
  },
  {
    key: 'informes',
    titulo: 'Informes',
    descripcion: 'Ver y exportar informes de evaluaciones realizadas',
    icono: <IconInformes />,
    color: { bg: '#fff7ed', border: '#fed7aa', iconBg: '#ffedd5', btn: '#e07b00' },
  },
];

export default function ModuloPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const tipoProyecto = location.state?.tipoProyecto || 'Módulo';
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleSalir = () => {
    localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/');
  };
const handleAcceder = (opcion) => {
  const tipoMap = {
    'crear': tipoProyecto,
    'evaluar': tipoProyecto,
    'informes': tipoProyecto,
  };

  console.log('Navegando con tipoProyecto:', tipoMap[opcion.key]);

  if (opcion.key === 'crear') {
    navigate('/crear-evaluacion', { state: { tipoProyecto } });
  } else if (opcion.key === 'evaluar') {
    navigate('/evaluar-proyectos', { state: { tipoProyecto } });
  } else if (opcion.key === 'informes') {
    navigate('/informes', { state: { tipoProyecto } });
  }
};
  return (
    <div style={s.page}>
      <style>{`
        .nav-btn:hover { color: #2d9a4e !important; }
        .logout-btn:hover { background: #f8f9fa !important; }
        .back-btn:hover { opacity: 0.7; }
        .opcion-btn:hover { opacity: 0.88; transform: translateY(-1px); }
      `}</style>
      <header style={s.header} className="resp-header">
        <div style={s.headerLeft}>
          <div style={s.logoCircle}><LeafIcon /></div>
          <div>
            <div style={s.headerTitle} className="resp-header-title">Sistema de Evaluación Ambiental - UNIMETA</div>
            <div style={s.headerSubtitle} className="resp-header-subtitle">Gestión de proyectos sostenibles</div>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.userInfo}>
            <div style={s.userName}>{usuario.nombre || 'Usuario'}</div>
            <div style={s.userRole}>{usuario.rol || 'Sin rol'}</div>
          </div>
          <button className="logout-btn" style={s.logoutBtn} onClick={handleSalir}><IconSalir /> Salir</button>
        </div>
      </header>
      <nav style={s.nav} className="resp-nav">
        <button className="nav-btn" style={s.navBtn(false)} onClick={() => navigate('/dashboard')}><IconDash /> Dashboard</button>
        <button className="nav-btn" style={s.navBtn(true)}><IconEval /> Evaluaciones</button>
      </nav>
      <main style={s.content} className="resp-content">
        <button className="back-btn resp-back-btn" style={s.backBtn} onClick={() => navigate('/dashboard')}><IconBack /> Volver al Dashboard</button>
        <div style={s.heroBanner} className="resp-hero">
          <div style={s.heroTitle} className="resp-hero-title">Módulo: {tipoProyecto}</div>
          <div style={s.heroSubtitle} className="r-hero-sub">Seleccione la opción que desea realizar</div>
        </div>
        <div style={s.opcionesGrid} className="resp-grid-3 resp-opcion-grid">
          {OPCIONES.map(opcion => (
            <div key={opcion.key} style={s.opcionCard(opcion.color)}>
              <div style={s.iconCircle(opcion.color)}>{opcion.icono}</div>
              <div style={s.opcionTitle}>{opcion.titulo}</div>
              <div style={s.opcionDesc}>{opcion.descripcion}</div>
              <button className="opcion-btn" style={s.opcionBtn(opcion.color)} onClick={() => handleAcceder(opcion)}>
                Acceder
              </button>
            </div>
          ))}
        </div>
        <div style={s.infoCard}>
          <div style={s.infoTitle}>Información del Módulo</div>
          <div style={s.infoItem}><span style={s.infoBold}>Crear Evaluación:</span> Permite registrar la información básica de un nuevo proyecto que será evaluado posteriormente.</div>
          <div style={s.infoItem}><span style={s.infoBold}>Evaluar:</span> Acceda a los proyectos registrados para realizar la evaluación según los criterios específicos de este tipo de proyecto.</div>
          <div style={s.infoItem}><span style={s.infoBold}>Informes:</span> Consulte las evaluaciones realizadas, visualice resultados detallados.</div>
        </div>
      </main>
    </div>
  );
}