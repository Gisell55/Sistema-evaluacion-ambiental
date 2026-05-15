import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MODULOS = [
  { id: 'relleno-sanitario', tipo: 'Relleno Sanitario', nombre: 'Relleno Sanitario', faIcon: 'fa-solid fa-mountain-city' },
  { id: 'planta-transferencia', tipo: 'Planta de transferencia', nombre: 'Planta de transferencia', faIcon: 'fa-solid fa-industry' },
  { id: 'residuos-organicos', tipo: 'Planta de tratamiento de residuos orgánicos putrescibles', nombre: 'Planta de tratamiento de residuos orgánicos putrescibles', faIcon: 'fa-solid fa-dumpster' },
  { id: 'residuos-inorganicos', tipo: 'Plantas de selección y transformación de residuos sólidos inorgánicos', nombre: 'Plantas de selección y transformación de residuos sólidos inorgánicos', faIcon: 'fa-solid fa-person-digging' },
];

const MEDAL = ['🥇', '🥈', '🥉'];

const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, promedio: '0.0' });
  const [ranking, setRanking] = useState([]);
  const dropRef = useRef(null);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => { cargar(); }, []);

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const cargar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data.stats);
      setRanking(res.data.ranking || []);
    } catch (e) { console.error(e); }
  };

  const salir = () => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/'); };
  const irModulo = (tipo) => { setOpen(false); navigate('/modulo', { state: { tipoProyecto: tipo } }); };
  const fmt = (f) => new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  const NAV_BTN = (active) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '0 16px', height: '48px', fontSize: '14px', fontWeight: '500',
    color: active ? '#2d9a4e' : '#5f6368',
    borderBottom: active ? '2px solid #2d9a4e' : '2px solid transparent',
    background: 'none', border: 'none', cursor: 'pointer', marginBottom: '-1px',
    userSelect: 'none', fontFamily: 'inherit',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f0faf3', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .dd-item:hover { background:#f0faf3!important; color:#2d9a4e!important; }
        .mod-card:hover { border-color:#2d9a4e!important; background:#f0faf3!important; }
        .mod-card:hover .mod-link { color:#2d9a4e!important; }
        .rk-row:hover { background:#f0faf3!important; }
        .btn-salir:hover { background:#f8f9fa!important; }
        .nav-btn:hover { color:#2d9a4e!important; }
      `}</style>

      {/* HEADER */}
      <header className="r-header">
        <div className="r-header-left">
          <div style={{ width:40,height:40,borderRadius:10,background:'linear-gradient(135deg,#2d9a4e,#1e7a3a)',display:'flex',alignItems:'center',justifyContent:'center' }} className="r-logo-circle">
            <LeafIcon />
          </div>
          <div>
            <div className="r-header-title">Sistema de Evaluación Ambiental</div>
            <div className="r-header-sub">Gestión de proyectos sostenibles</div>
          </div>
        </div>
        <div className="r-header-right">
          <div style={{ textAlign:'right' }}>
            <div className="r-user-name">{usuario.nombre || 'Usuario'}</div>
            <div className="r-user-role">{usuario.rol || 'Sin rol'}</div>
          </div>
          <button className="btn-salir" onClick={salir} style={{
            display:'flex',alignItems:'center',gap:6,padding:'8px 14px',
            borderRadius:8,border:'1px solid #e8eaed',background:'#fff',
            fontSize:13,fontWeight:600,color:'#5f6368',cursor:'pointer',
          }}>
            <i className="fa-solid fa-right-from-bracket" />
            <span className="r-logout-text">Salir</span>
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav className="r-nav">
        {/* Dashboard */}
        <button className="nav-btn" style={NAV_BTN(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents:'none'}}>
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span style={{pointerEvents:'none'}}>Dashboard</span>
        </button>
  
        {/* Evaluaciones */}
<div ref={dropRef} style={{ position: 'relative', zIndex: 1000 }}>
  <button
    className="nav-btn"
    onClick={() => setOpen(v => !v)}
    style={NAV_BTN(open)}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents:'none'}}>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
    <span style={{pointerEvents:'none'}}>Evaluaciones</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.2s', pointerEvents:'none' }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  {open && (
    <div style={{
      position: 'fixed',
      top: `calc(64px + 48px + 16px)`, /* header + nav height + padding */
      left: '32px',
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid #e8eaed',
      minWidth: 340,
      zIndex: 9999,
      overflow: 'hidden',
      animation: 'dropIn 0.15s ease',
    }}>
      {MODULOS.map((m, i) => (
        <div key={m.id} className="dd-item" onClick={() => irModulo(m.tipo)} style={{
          display:'flex', alignItems:'center', gap:12, padding:'13px 20px',
          cursor:'pointer', fontSize:14, fontWeight:500, color:'#202124',
          borderBottom: i < MODULOS.length - 1 ? '1px solid #f1f3f4' : 'none',
          transition:'background 0.15s',
        }}>
          <i className={m.faIcon} style={{ fontSize:16, color:'#5f6368', width:20, textAlign:'center' }} />
          {m.nombre}
        </div>
      ))}
    </div>
  )}
</div>
    </nav>
      {/* CONTENIDO */}
      <main className="r-content">
        <h1 style={{ fontSize:28, fontWeight:700, color:'#202124', marginBottom:4 }}>Dashboard</h1>
        <p style={{ fontSize:14, color:'#5f6368', marginBottom:28 }}>Resumen de evaluaciones y proyectos ambientales</p>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }} className="r-stats-grid">
          {[
            { label:'Total Evaluaciones', val: stats.total, color:'#202124', sub:'Evaluaciones realizadas en total', icon:'fa-regular fa-clipboard-check', iconColor:'#2d9a4e' },
            { label:'Puntuación Promedio', val: `${stats.promedio}%`, color:'#1a73e8', sub:'Promedio de todas las evaluaciones', icon:'fa-solid fa-chart-line', iconColor:'#1a73e8' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:24, border:'1px solid #e8eaed', boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'#5f6368', fontWeight:500 }}>{s.label}</span>
                <i className={s.icon} style={{ fontSize:20, color: s.iconColor }} />
              </div>
              <div style={{ fontSize:36, fontWeight:800, color: s.color, marginBottom:4 }}>{s.val}</div>
              <div style={{ fontSize:12, color:'#9aa0a6' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* MÓDULOS */}
        <div style={{ background:'#fff', borderRadius:14, padding:24, border:'1px solid #e8eaed', boxShadow:'0 1px 4px rgba(0,0,0,.06)', marginBottom:24 }}>
          <div style={{ fontSize:16, fontWeight:700, color:'#202124', marginBottom:4 }}>Evaluaciones por Módulo</div>
          <div style={{ fontSize:13, color:'#5f6368', marginBottom:20 }}>Seleccione el tipo de proyecto ambiental que desea evaluar</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="r-grid-2">
            {MODULOS.map(m => (
              <div key={m.id} className="mod-card" onClick={() => irModulo(m.tipo)} style={{
                border:'1px solid #e8eaed', borderRadius:12, padding:'18px 20px',
                cursor:'pointer', transition:'all 0.2s', background:'#fff',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                  <i className={m.faIcon} style={{ fontSize:22, color:'#2d9a4e', width:26, textAlign:'center' }} />
                  <span style={{ fontSize:14, fontWeight:700, color:'#202124' }}>{m.nombre}</span>
                </div>
                <div className="mod-link" style={{ fontSize:13, color:'#5f6368', fontWeight:500 }}>Iniciar evaluación →</div>
              </div>
            ))}
          </div>
        </div>

        {/* RANKING */}
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e8eaed', boxShadow:'0 1px 4px rgba(0,0,0,.06)', overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f3f4', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#fff7ed', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="fa-solid fa-trophy" style={{ fontSize:18, color:'#e07b00' }} />
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'#202124' }}>Ranking de Evaluaciones</div>
              <div style={{ fontSize:13, color:'#5f6368', marginTop:2 }}>Proyectos ordenados de mayor a menor puntaje — {ranking.length} evaluación(es)</div>
            </div>
          </div>

          {ranking.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 0' }}>
              <i className="fa-regular fa-clipboard" style={{ fontSize:48, color:'#d1d5db' }} />
              <div style={{ fontSize:14, fontWeight:600, color:'#9aa0a6', marginTop:14 }}>No hay evaluaciones registradas</div>
              <div style={{ fontSize:13, color:'#bdc1c6', marginTop:4 }}>Completa tu primera evaluación para ver el ranking aquí</div>
            </div>
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'48px 1fr 160px 160px', padding:'10px 24px', background:'#f8f9fa', borderBottom:'1px solid #f1f3f4' }} className="r-ranking-grid">
                {['#','Proyecto','Puntaje','Fecha'].map((h, i) => (
                  <span key={h} style={{ fontSize:11, fontWeight:700, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.05em', textAlign: i===2?'center':i===3?'right':'left' }}>{h}</span>
                ))}
              </div>
              {ranking.map((ev, i) => (
                <div key={ev.id} className="rk-row r-ranking-grid" style={{
                  display:'grid', gridTemplateColumns:'48px 1fr 160px 160px',
                  padding:'14px 24px', alignItems:'center',
                  background: i%2===0 ? '#fff' : '#fafafa',
                  borderBottom: i < ranking.length-1 ? '1px solid #f1f3f4' : 'none',
                  transition:'background 0.15s',
                }}>
                  <div style={{ display:'flex', alignItems:'center' }}>
                    {i < 3
                      ? <span style={{ fontSize:22 }}>{MEDAL[i]}</span>
                      : <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, background:'#f8f9fa', color:'#9aa0a6', border:'1.5px solid #e8eaed' }}>{i+1}</div>
                    }
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#202124', marginBottom:2 }}>{ev.nombre_proyecto}</div>
                    <div style={{ fontSize:11, color:'#9aa0a6' }}>{ev.tipo_proyecto}</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:16, fontWeight:800, color: ev.porcentaje>=70?'#2d9a4e':ev.porcentaje>=50?'#e07b00':'#5f6368' }}>{ev.puntaje_total} pts</div>
                    <div style={{ fontSize:11, color:'#9aa0a6', marginBottom:4 }}>{ev.porcentaje}% de {ev.puntaje_maximo}</div>
                    <div style={{ height:5, background:'#f1f3f4', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:3, width:`${ev.porcentaje}%`, background: ev.porcentaje>=70?'#2d9a4e':ev.porcentaje>=50?'#e07b00':'#9aa0a6', transition:'width 0.8s ease' }} />
                    </div>
                  </div>
                  <div className="r-ranking-fecha" style={{ fontSize:13, color:'#5f6368', textAlign:'right' }}>{fmt(ev.fecha_evaluacion)}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}