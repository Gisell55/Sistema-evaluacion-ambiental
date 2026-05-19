import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

/* ── Íconos ─────────────────────────────────────────── */
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
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

/* ── Colores por criterio ─── */
const CRITERIO_COLORS = [
  { bg: '#fef9c3', border: '#fde047', text: '#854d0e', light: '#fefce8' },
  { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a', light: '#eff6ff' },
  { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d', light: '#fdf2f8' },
  { bg: '#dcfce7', border: '#86efac', text: '#14532d', light: '#f0fdf4' },
  { bg: '#ffedd5', border: '#fdba74', text: '#9a3412', light: '#fff7ed' },
];

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
    position: 'sticky', top: '64px', zIndex: 100, overflowX: 'auto',
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
};

/* ════════════════════════════════════════════════════════════ */
/* LISTA DE PROYECTOS                                           */
/* ════════════════════════════════════════════════════════════ */
function ListaProyectos({ tipoProyecto, onSeleccionar, onCrearNuevo }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${API_URL}/api/evaluar/pendientes/${encodeURIComponent(tipoProyecto)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProyectos(res.data.proyectos);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    cargar();
  }, [tipoProyecto]);

  const pendientes = proyectos.filter(p => p.estado === 'pendiente');
  const evaluados = proyectos.filter(p => p.estado === 'evaluado');
  const formatFecha = (f) => new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e8f5ec',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconEval />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#202124' }}>Evaluar Proyectos</div>
            <div style={{ fontSize: '13px', color: '#5f6368' }}>{tipoProyecto}</div>
          </div>
        </div>
        <button onClick={onCrearNuevo}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            borderRadius: '10px', background: 'linear-gradient(135deg,#2d9a4e,#1e7a3a)',
            color: '#fff', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(45,154,78,0.3)' }}>
          + Crear Nueva Evaluación
        </button>
      </div>

      {/* Pendientes */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: '#e07b00' }}>⊙</span>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#202124' }}>Proyectos Pendientes de Evaluación</span>
        </div>
        <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '16px' }}>
          {pendientes.length} proyecto(s) esperando evaluación
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#9aa0a6' }}>Cargando...</div>
        ) : pendientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#9aa0a6', fontSize: '14px' }}>
            No hay proyectos pendientes de evaluación
          </div>
        ) : (
          pendientes.map(p => (
            <div key={p.id} className="r-eval-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid #e8eaed', borderRadius: '10px', marginBottom: '10px', background: '#fafafa' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#202124' }}>{p.nombre_proyecto}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#e07b00',
                    background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '20px', padding: '2px 10px' }}>
                    Pendiente
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9aa0a6' }}>
                  <IconClock /> Creado: {formatFecha(p.fecha_creacion)}
                </div>
              </div>
              <button onClick={() => onSeleccionar(p.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 18px', borderRadius: '9px',
                  background: 'linear-gradient(135deg,#2d9a4e,#1e7a3a)',
                  color: '#fff', fontWeight: '700', fontSize: '13px',
                  border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(45,154,78,0.3)' }}>
                <IconEval /> Evaluar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Evaluados */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: '#2d9a4e' }}>⊙</span>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#202124' }}>Proyectos Evaluados</span>
        </div>
        <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '16px' }}>
          {evaluados.length} proyecto(s) con evaluación completada
        </div>
        {evaluados.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', color: '#9aa0a6' }}>
            <IconClipboard />
            <div style={{ fontSize: '14px', marginTop: '12px' }}>No hay proyectos evaluados aún</div>
          </div>
        ) : (
          evaluados.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', border: '1px solid #e8eaed', borderRadius: '10px',
              marginBottom: '10px', background: '#f0faf3' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#202124' }}>{p.nombre_proyecto}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#2d9a4e',
                    background: '#dcfce7', border: '1px solid #86efac', borderRadius: '20px', padding: '2px 10px' }}>
                    Evaluado
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#9aa0a6' }}>Creado: {formatFecha(p.fecha_creacion)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2d9a4e', fontWeight: '700', fontSize: '13px' }}>
                ✓ Completado
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
/* FORMULARIO DE EVALUACIÓN — BUG CORREGIDO                    */
/* Ahora cuenta parámetros seleccionados, no subparámetros     */
/* ════════════════════════════════════════════════════════════ */
function FormularioEvaluacion({ proyectoId, tipoProyecto, onVolver, onGuardado }) {
  const [proyecto, setProyecto] = useState(null);
  // selecciones: { [parametroId]: { subId, puntos } }
  const [selecciones, setSelecciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/evaluar/detalle/${proyectoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProyecto(res.data.proyecto);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    cargar();
  }, [proyectoId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#9aa0a6', fontSize: '16px' }}>Cargando proyecto...</div>;
  if (!proyecto) return <div style={{ textAlign: 'center', padding: '60px', color: '#d93025' }}>Proyecto no encontrado</div>;

  /* ── Contar parámetros totales (uno por parametro, no por subparametro) ── */
  const totalParametros = proyecto.criterios.reduce((s, c) => s + c.parametros.length, 0);
  const parametrosSeleccionados = Object.keys(selecciones).length;
  const completo = parametrosSeleccionados >= totalParametros;

  /* ── Calcular puntaje por criterio ── */
  const desglose = proyecto.criterios.map(c => {
    let puntsCriterio = 0;
    c.parametros.forEach(p => {
      if (selecciones[p.id]) puntsCriterio += selecciones[p.id].puntos;
    });
    return { nombre: c.nombre, puntos: puntsCriterio, max: c.puntos };
  });
  const puntajeTotal = desglose.reduce((s, d) => s + d.puntos, 0);

  /* ── Seleccionar un subparámetro dentro de un parámetro ── */
  const seleccionarSub = (parametroId, subId, puntos) => {
    setSelecciones(prev => ({
      ...prev,
      [parametroId]: { subId, puntos }
    }));
  };

  /* ── Guardar ── */
  const guardar = async () => {
    if (!completo) { setError('Debe seleccionar una opción en cada parámetro antes de guardar.'); return; }
    setSaving(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const respuestas = Object.entries(selecciones).map(([paramId, sel]) => ({
        subparametroId: sel.subId,
        puntos: sel.puntos,
      }));
      await axios.post('/api/evaluar/guardar',
        { proyectoId, respuestas, puntajeTotal, puntajeMaximo: proyecto.base_calculo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onGuardado({ proyecto, puntajeTotal, desglose });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la evaluación');
    } finally { setSaving(false); }
  };

  const formatFecha = (f) => new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Encabezado proyecto */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '24px 28px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#202124', marginBottom: '4px' }}>
          {proyecto.nombre_proyecto}
        </div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d9a4e', marginBottom: '16px' }}>{tipoProyecto}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="r-grid-3 r-info-grid">
          {[
            ['Ubicación', proyecto.ubicacion],
            ['Responsables', proyecto.responsables],
            ['Fecha creación', formatFecha(proyecto.fecha_creacion)],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '13px', color: '#202124', fontWeight: '500' }}>{val || '—'}</div>
            </div>
          ))}
        </div>
        {proyecto.descripcion && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f8f9fa', borderRadius: '8px',
            fontSize: '13px', color: '#5f6368', lineHeight: '1.6' }}>
            {proyecto.descripcion}
          </div>
        )}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', fontWeight: '600', color: '#5f6368' }}>
          📊 Base de cálculo: <span style={{ color: '#202124', fontWeight: '800' }}>{proyecto.base_calculo} puntos</span>
          &nbsp;|&nbsp; Parámetros seleccionados:{' '}
          <span style={{ color: completo ? '#2d9a4e' : '#e07b00', fontWeight: '800' }}>
            {parametrosSeleccionados}/{totalParametros}
          </span>
        </div>
      </div>

      {/* Criterios */}
      {proyecto.criterios.map((criterio, ci) => {
        const col = CRITERIO_COLORS[ci % CRITERIO_COLORS.length];
        return (
          <div key={criterio.id} style={{ background: col.bg, border: `1.5px solid ${col.border}`,
            borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: col.text }}>{criterio.nombre}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: col.text, opacity: 0.75, marginTop: '2px' }}>
                  Puntaje disponible: {criterio.puntos} pts
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: col.text }}>
                {desglose[ci]?.puntos || 0} / {criterio.puntos} pts
              </div>
            </div>

            {criterio.parametros.map((param) => {
              const selActual = selecciones[param.id];
              return (
                <div key={param.id} style={{ background: '#fff', borderRadius: '10px',
                  border: '1px solid #e8eaed', marginBottom: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: col.light, borderBottom: '1px solid #e8eaed',
                    fontSize: '14px', fontWeight: '700', color: '#202124' }}>
                    {param.nombre}
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    {param.subparametros.map((sub, si) => {
                      const isChecked = selActual?.subId === sub.id;
                      return (
                        <label key={sub.id}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 16px', cursor: 'pointer',
                            borderBottom: si < param.subparametros.length - 1 ? '1px solid #f1f3f4' : 'none',
                            background: isChecked ? col.light : 'transparent',
                            transition: 'background 0.15s',
                          }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <input
                              type="radio"
                              name={`param-${param.id}`}
                              style={{ accentColor: col.text, width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
                              checked={isChecked}
                              onChange={() => seleccionarSub(param.id, sub.id, sub.puntos)}
                            />
                            <span style={{ fontSize: '13px', color: '#202124', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                              {sub.nombre}
                            </span>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: col.text, minWidth: '60px', textAlign: 'right', marginLeft: '12px' }}>
                            {sub.puntos} pts
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
          background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '16px', color: '#c2410c', fontSize: '13px', fontWeight: '600' }}>
          ⚠ {error}
        </div>
      )}

      {/* Botones */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} className="resp-nav-btns">
        <button onClick={onVolver}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px',
            borderRadius: '10px', border: '1.5px solid #e8eaed', background: '#fff',
            fontSize: '14px', fontWeight: '700', color: '#5f6368', cursor: 'pointer' }}>
          <IconBack /> Volver
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: completo ? '#2d9a4e' : '#9aa0a6', fontWeight: '600' }}>
            {completo
              ? '✓ Todos los parámetros seleccionados'
              : `${totalParametros - parametrosSeleccionados} parámetro(s) sin seleccionar`}
          </span>
          <button onClick={guardar} disabled={saving || !completo}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 24px',
              borderRadius: '10px',
              background: completo ? 'linear-gradient(135deg,#2d9a4e,#1e7a3a)' : '#e8eaed',
              color: completo ? '#fff' : '#9aa0a6', fontSize: '14px', fontWeight: '700',
              border: 'none', cursor: completo ? 'pointer' : 'not-allowed',
              boxShadow: completo ? '0 4px 12px rgba(45,154,78,0.3)' : 'none' }}>
            <IconSave /> {saving ? 'Guardando...' : 'Guardar Evaluación'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
/* RESULTADO                                                    */
/* ════════════════════════════════════════════════════════════ */
function ResultadoEvaluacion({ proyecto, puntajeTotal, desglose, onVolver }) {
  const porcentaje = ((puntajeTotal / proyecto.base_calculo) * 100).toFixed(1);
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#2d9a4e,#1e7a3a)', borderRadius: '16px',
        padding: '32px 36px', marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontWeight: '600' }}>
          RESULTADO DE LA EVALUACIÓN
        </div>
        <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>
          {puntajeTotal} / {proyecto.base_calculo}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>
          {porcentaje}% del puntaje máximo
        </div>
        <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
          {proyecto.nombre_proyecto}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '24px 28px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '17px', fontWeight: '700', color: '#202124', marginBottom: '20px' }}>
          Desglose por Criterio
        </div>
        {desglose.map((d, i) => {
          const col = CRITERIO_COLORS[i % CRITERIO_COLORS.length];
          const pct = d.max > 0 ? (d.puntos / d.max * 100).toFixed(1) : 0;
          return (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#202124' }}>{d.nombre}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: col.text }}>
                  {d.puntos} / {d.max} pts ({pct}%)
                </span>
              </div>
              <div style={{ height: '10px', background: '#f1f3f4', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: col.border, borderRadius: '6px', transition: 'width 1s ease' }} />
              </div>
            </div>
          );
        })}
        <div style={{ borderTop: '2px solid #e8eaed', paddingTop: '16px', marginTop: '8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#202124' }}>Total obtenido</span>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#2d9a4e' }}>
            {puntajeTotal} / {proyecto.base_calculo} pts
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={onVolver}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
            borderRadius: '10px', background: 'linear-gradient(135deg,#2d9a4e,#1e7a3a)',
            color: '#fff', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(45,154,78,0.3)' }}>
          Volver al Módulo
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
/* COMPONENTE PRINCIPAL                                         */
/* ════════════════════════════════════════════════════════════ */
export default function EvaluarProyectos() {
  const navigate = useNavigate();
  const location = useLocation();
  const tipoProyecto = location.state?.tipoProyecto || '';
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [vista, setVista] = useState('lista');
  const [proyectoSelId, setProyectoSelId] = useState(null);
  const [resultado, setResultado] = useState(null);

  const handleSalir = () => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/'); };
  const irAModulo = () => navigate('/modulo', { state: { tipoProyecto } });

  return (
    <div style={s.page}>
      <style>{`.ev-logout:hover{background:#f8f9fa!important} .ev-back:hover{opacity:0.7}`}</style>
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
            <div style={s.userName} className="resp-header-username">{usuario.nombre || 'Usuario'}</div>
            <div style={s.userRole} className="resp-header-role">{usuario.rol || 'Sin rol'}</div>
          </div>
          <button className="ev-logout" style={s.logoutBtn} onClick={handleSalir}><IconSalir /> Salir</button>
        </div>
      </header>
      <nav style={s.nav} className="r-nav">
        <button style={s.navBtn(false)} onClick={() => navigate('/dashboard')}><IconDash /> Dashboard</button>
        <button style={s.navBtn(true)}><IconEval /> Evaluaciones</button>
      </nav>
      <main style={s.content} className="r-content-narrow">
        <button className="ev-back" style={s.backBtn} onClick={irAModulo}><IconBack /> Volver al Módulo</button>
        {vista === 'lista' && (
          <ListaProyectos
            tipoProyecto={tipoProyecto}
            onSeleccionar={(id) => { setProyectoSelId(id); setVista('formulario'); }}
            onCrearNuevo={() => navigate('/crear-evaluacion', { state: { tipoProyecto } })}
          />
        )}
        {vista === 'formulario' && (
          <FormularioEvaluacion
            proyectoId={proyectoSelId}
            tipoProyecto={tipoProyecto}
            onVolver={() => setVista('lista')}
            onGuardado={(data) => { setResultado(data); setVista('resultado'); }}
          />
        )}
        {vista === 'resultado' && resultado && (
          <ResultadoEvaluacion
            proyecto={resultado.proyecto}
            puntajeTotal={resultado.puntajeTotal}
            desglose={resultado.desglose}
            onVolver={irAModulo}
          />
        )}
      </main>
    </div>
  );
}