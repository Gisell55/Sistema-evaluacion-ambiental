import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/* ── Colores criterios ── */
const COLS = [
  { bg: '#fef9c3', border: '#fde047', text: '#854d0e', light: '#fefce8', bar: '#fbbf24' },
  { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a', light: '#eff6ff', bar: '#3b82f6' },
  { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d', light: '#fdf2f8', bar: '#ec4899' },
  { bg: '#dcfce7', border: '#86efac', text: '#14532d', light: '#f0fdf4', bar: '#22c55e' },
  { bg: '#ffedd5', border: '#fdba74', text: '#9a3412', light: '#fff7ed', bar: '#f97316' },
];

/* ── Íconos ── */
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
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEmpty = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const s = {
  page: { minHeight: '100vh', background: '#f0faf3', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: {
    background: '#fff', borderBottom: '1px solid #e8eaed', padding: '0 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '64px', position: 'sticky', top: 0, zIndex: 200,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoCircle: { width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg,#2d9a4e,#1e7a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
    border: '1px solid #e8eaed', background: '#fff', fontSize: '13px', fontWeight: '600', color: '#5f6368', cursor: 'pointer' },
  nav: { background: '#fff', borderBottom: '1px solid #e8eaed', padding: '0 32px', display: 'flex',
    gap: '4px', position: 'sticky', top: '64px', zIndex: 100, overflowX: 'auto' },
  navBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px',
    fontSize: '14px', fontWeight: '500', color: active ? '#2d9a4e' : '#5f6368',
    borderBottom: active ? '2px solid #2d9a4e' : '2px solid transparent',
    background: 'none', border: 'none', cursor: 'pointer', marginBottom: '-1px',
  }),
  content: { padding: '28px 32px', maxWidth: '1000px', margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#202124', marginBottom: '20px', padding: '0' },
};

/* ════════════════════════ LISTA DE INFORMES ════════════════════════ */
function ListaInformes({ tipoProyecto, onVerDetalle }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `/api/informes/lista/${encodeURIComponent(tipoProyecto)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvaluaciones(res.data.evaluaciones);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    cargar();
  }, [tipoProyecto]);

  const formatFecha = (f) => new Date(f).toLocaleDateString('es-CO',
    { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      {/* Encabezado */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ffedd5',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e07b00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#202124' }}>Informes de Evaluaciones</div>
          <div style={{ fontSize: '13px', color: '#5f6368' }}>{tipoProyecto}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9aa0a6' }}>Cargando informes...</div>
      ) : evaluaciones.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
          padding: '60px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <IconEmpty />
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#9aa0a6', marginTop: '16px' }}>
            No hay evaluaciones realizadas aún
          </div>
          <div style={{ fontSize: '13px', color: '#bdc1c6', marginTop: '6px' }}>
            Complete evaluaciones en el módulo "Evaluar" para ver los informes aquí
          </div>
        </div>
      ) : (
        <>
          {/* Resumen global */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }} className="r-grid-3 r-summary-grid">
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
              padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#202124' }}>{evaluaciones.length}</div>
              <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>Total de evaluaciones</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
              padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#2d9a4e' }}>
                {Math.round(evaluaciones.reduce((s, e) => s + (e.puntaje_total / e.puntaje_maximo * 100), 0) / evaluaciones.length)}%
              </div>
              <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>Promedio general</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
              padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e3a8a' }}>
                {Math.max(...evaluaciones.map(e => e.puntaje_total))}
              </div>
              <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>Puntaje más alto</div>
            </div>
          </div>

          {/* Lista de evaluaciones */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f3f4', fontSize: '15px', fontWeight: '700', color: '#202124' }}>
              Historial de Evaluaciones
            </div>
            {evaluaciones.map((ev, i) => {
              const pct = ((ev.puntaje_total / ev.puntaje_maximo) * 100).toFixed(1);
              return (
                <div key={ev.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 24px', borderBottom: i < evaluaciones.length - 1 ? '1px solid #f1f3f4' : 'none',
                  background: i % 2 === 0 ? '#fff' : '#fafafa', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#202124', marginBottom: '4px' }}>
                      {ev.nombre_proyecto}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9aa0a6' }}>
                      Evaluado: {formatFecha(ev.fecha_evaluacion)}
                    </div>
                    {ev.ubicacion && (
                      <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '2px' }}>
                        📍 {ev.ubicacion}
                      </div>
                    )}
                  </div>

                  {/* Barra de progreso mini */}
                  <div style={{ minWidth: '160px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#5f6368' }}>Puntaje</span>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#2d9a4e' }}>{pct}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f3f4', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#2d9a4e,#1e7a3a)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#9aa0a6', marginTop: '3px', textAlign: 'right' }}>
                      {ev.puntaje_total} / {ev.puntaje_maximo} pts
                    </div>
                  </div>

                  <button onClick={() => onVerDetalle(ev.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
                      borderRadius: '9px', background: '#fff7ed', border: '1.5px solid #fdba74',
                      color: '#e07b00', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                      whiteSpace: 'nowrap' }}>
                    <IconEye /> Ver detalle
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════ DETALLE DEL INFORME ════════════════════════ */
function DetalleInforme({ evaluacionId, onVolver }) {
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/informes/detalle/${evaluacionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvaluacion(res.data.evaluacion);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    cargar();
  }, [evaluacionId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#9aa0a6' }}>Cargando informe...</div>;
  if (!evaluacion) return <div style={{ textAlign: 'center', padding: '60px', color: '#d93025' }}>Informe no encontrado</div>;

  const porcentaje = ((evaluacion.puntaje_total / evaluacion.puntaje_maximo) * 100).toFixed(1);
  const formatFecha = (f) => new Date(f).toLocaleDateString('es-CO',
    { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      {/* Botón volver */}
      <button onClick={onVolver}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#202124', marginBottom: '20px', padding: '0' }}>
        <IconBack /> Volver a la lista de informes
      </button>

      {/* Banner resultado */}
      <div style={{ background: 'linear-gradient(135deg,#2d9a4e,#1e7a3a)', borderRadius: '16px',
        padding: '28px 32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px', fontWeight: '600' }}>
              INFORME DE EVALUACIÓN
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              {evaluacion.nombre_proyecto}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
              {evaluacion.tipo_proyecto}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '44px', fontWeight: '900', color: '#fff', lineHeight: 1 }}>
              {evaluacion.puntaje_total}
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>
              / {evaluacion.puntaje_maximo} pts ({porcentaje}%)
            </div>
          </div>
        </div>
      </div>

      {/* Datos del proyecto */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#202124', marginBottom: '16px' }}>
          Datos del Proyecto
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="r-grid-2">
          {[
            ['Nombre del proyecto', evaluacion.nombre_proyecto],
            ['Tipo de proyecto', evaluacion.tipo_proyecto],
            ['Ubicación', evaluacion.ubicacion || '—'],
            ['Responsables', evaluacion.responsables || '—'],
            ['Fecha de evaluación', formatFecha(evaluacion.fecha_evaluacion)],
            ['Base de cálculo', `${evaluacion.puntaje_maximo} puntos`],
          ].map(([label, val]) => (
            <div key={label} style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '14px', color: '#202124', fontWeight: '500' }}>{val}</div>
            </div>
          ))}
        </div>
        {evaluacion.descripcion && (
          <div style={{ marginTop: '12px', padding: '12px 16px', background: '#f0faf3', borderRadius: '10px',
            fontSize: '13px', color: '#5f6368', lineHeight: '1.6' }}>
            <span style={{ fontWeight: '700', color: '#202124' }}>Descripción: </span>
            {evaluacion.descripcion}
          </div>
        )}
      </div>

      {/* Desglose por criterio */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#202124', marginBottom: '20px' }}>
          Resumen por Criterio
        </div>
        {evaluacion.criterios.map((c, ci) => {
          const col = COLS[ci % COLS.length];
          const pct = c.puntos > 0 ? (c.puntaje_obtenido / c.puntos * 100).toFixed(1) : 0;
          return (
            <div key={c.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: col.text }}>{c.nombre}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: col.text }}>
                  {c.puntaje_obtenido} / {c.puntos} pts ({pct}%)
                </span>
              </div>
              <div style={{ height: '10px', background: '#f1f3f4', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: col.bar, borderRadius: '6px', transition: 'width 1s ease' }} />
              </div>
            </div>
          );
        })}
        <div style={{ borderTop: '2px solid #e8eaed', paddingTop: '14px', marginTop: '8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#202124' }}>TOTAL OBTENIDO</span>
          <span style={{ fontSize: '22px', fontWeight: '900', color: '#2d9a4e' }}>
            {evaluacion.puntaje_total} / {evaluacion.puntaje_maximo} pts ({porcentaje}%)
          </span>
        </div>
      </div>

      {/* Detalle por criterio con parámetros y subparámetros */}
      <div style={{ fontSize: '17px', fontWeight: '700', color: '#202124', marginBottom: '16px' }}>
        Detalle Completo por Criterio
      </div>
      {evaluacion.criterios.map((criterio, ci) => {
        const col = COLS[ci % COLS.length];
        return (
          <div key={criterio.id} style={{ background: col.bg, border: `1.5px solid ${col.border}`,
            borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: col.text }}>{criterio.nombre}</div>
                <div style={{ fontSize: '12px', color: col.text, opacity: 0.75, marginTop: '2px', fontWeight: '600' }}>
                  Puntaje disponible: {criterio.puntos} pts
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: col.text }}>
                  {criterio.puntaje_obtenido} / {criterio.puntos} pts
                </div>
                <div style={{ fontSize: '12px', color: col.text, opacity: 0.75 }}>
                  {criterio.puntos > 0 ? (criterio.puntaje_obtenido / criterio.puntos * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            {criterio.parametros.map((param) => (
              <div key={param.id} style={{ background: '#fff', borderRadius: '10px',
                border: '1px solid #e8eaed', marginBottom: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: col.light, borderBottom: '1px solid #e8eaed',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#202124' }}>{param.nombre}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: col.text }}>
                    {param.puntos_obtenidos} pts obtenidos
                  </span>
                </div>
                <div style={{ padding: '4px 0' }}>
                  {param.subparametros.map((sub, si) => (
                    <div key={sub.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 16px',
                      background: sub.seleccionado ? col.light : 'transparent',
                      borderBottom: si < param.subparametros.length - 1 ? '1px solid #f1f3f4' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: `2px solid ${sub.seleccionado ? col.text : '#d1d5db'}`,
                          background: sub.seleccionado ? col.text : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: '1px',
                        }}>
                          {sub.seleccionado && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          color: sub.seleccionado ? '#202124' : '#9aa0a6',
                          fontWeight: sub.seleccionado ? '600' : '400',
                          lineHeight: '1.5', whiteSpace: 'pre-wrap',
                        }}>
                          {sub.nombre}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '13px', fontWeight: '800',
                        color: sub.seleccionado ? col.text : '#d1d5db',
                        minWidth: '60px', textAlign: 'right', marginLeft: '12px',
                      }}>
                        {sub.puntos} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════ COMPONENTE PRINCIPAL ════════════════════════ */
export default function Informes() {
  const navigate = useNavigate();
  const location = useLocation();
  const tipoProyecto = location.state?.tipoProyecto || '';
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [vista, setVista] = useState('lista');
  const [evalSelId, setEvalSelId] = useState(null);

  const handleSalir = () => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/'); };
  const irAModulo = () => navigate('/modulo', { state: { tipoProyecto } });

  return (
    <div style={s.page}>
      <style>{`.inf-logout:hover{background:#f8f9fa!important} .inf-back:hover{opacity:0.7}`}</style>
      <header style={s.header} className="r-header">
        <div style={s.headerLeft}>
          <div style={s.logoCircle}><LeafIcon /></div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#202124' }} className="resp-header-title">
              Sistema de Evaluación Ambiental
            </div>
            <div style={{ fontSize: '11px', color: '#5f6368', marginTop: '1px' }} className="resp-header-subtitle">
              Gestión de proyectos sostenibles
            </div>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#202124' }}>{usuario.nombre || 'Usuario'}</div>
            <div style={{ fontSize: '12px', color: '#5f6368' }}>{usuario.rol || 'Sin rol'}</div>
          </div>
          <button className="inf-logout" style={s.logoutBtn} onClick={handleSalir}><IconSalir /> Salir</button>
        </div>
      </header>

      <nav style={s.nav} className="r-nav">
        <button style={s.navBtn(false)} onClick={() => navigate('/dashboard')}><IconDash /> Dashboard</button>
        <button style={s.navBtn(true)}><IconEval /> Evaluaciones</button>
      </nav>

      <main style={s.content} className="r-content-narrow">
        <button className="inf-back" style={s.backBtn} onClick={irAModulo}>
          <IconBack /> Volver al Módulo
        </button>

        {vista === 'lista' && (
          <ListaInformes
            tipoProyecto={tipoProyecto}
            onVerDetalle={(id) => { setEvalSelId(id); setVista('detalle'); }}
          />
        )}
        {vista === 'detalle' && (
          <DetalleInforme
            evaluacionId={evalSelId}
            onVolver={() => setVista('lista')}
          />
        )}
      </main>
    </div>
  );
}