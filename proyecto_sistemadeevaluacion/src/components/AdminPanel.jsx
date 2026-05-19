import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/recuperacion/solicitudes',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSolicitudes(res.data.solicitudes);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetear = async (id, nombre) => {
    if (!window.confirm(`¿Resetear la contraseña de ${nombre}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/recuperacion/resetear/${id}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message);
      cargar();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error al resetear.');
    }
  };

  const fmt = (f) => new Date(f).toLocaleDateString('es-CO',
    { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente');
  const atendidas  = solicitudes.filter(s => s.estado === 'atendida');

  return (
    <div style={{ minHeight: '100vh', background: '#f0faf3', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e8eaed', padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#202124' }}>
          🛡️ Panel de Administrador
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#5f6368' }}>{usuario.nombre}</span>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8eaed',
              background: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#202124', marginBottom: '6px' }}>
          Solicitudes de Recuperación de Contraseña
        </h2>
        <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '24px' }}>
          Gestiona las solicitudes de usuarios que olvidaron su contraseña
        </p>

        {msg && (
          <div style={{ background: '#f0faf3', border: '1px solid #a8d5b5', borderRadius: '10px',
            padding: '12px 16px', marginBottom: '20px', fontSize: '14px',
            fontWeight: '600', color: '#1e7a3a' }}>
            ✓ {msg}
          </div>
        )}

        {/* Pendientes */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
          padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#e07b00', marginBottom: '4px' }}>
            ⊙ Pendientes ({pendientes.length})
          </div>
          <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '16px' }}>
            Estos usuarios están esperando que resetees su contraseña
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9aa0a6' }}>Cargando...</div>
          ) : pendientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9aa0a6', fontSize: '14px' }}>
              No hay solicitudes pendientes ✓
            </div>
          ) : pendientes.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', border: '1px solid #fdba74', borderRadius: '10px',
              marginBottom: '10px', background: '#fff7ed', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#202124' }}>{s.nombre}</div>
                <div style={{ fontSize: '13px', color: '#5f6368' }}>{s.email}</div>
                <div style={{ fontSize: '12px', color: '#9aa0a6', marginTop: '2px' }}>
                  Solicitado: {fmt(s.fecha_solicitud)}
                </div>
              </div>
              <button onClick={() => resetear(s.id, s.nombre)}
                style={{ padding: '10px 20px', borderRadius: '10px',
                  background: 'linear-gradient(135deg,#2d9a4e,#1e7a3a)',
                  color: '#fff', fontWeight: '700', fontSize: '13px',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(45,154,78,0.3)' }}>
                🔑 Resetear contraseña
              </button>
            </div>
          ))}
        </div>

        {/* Atendidas */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
          padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d9a4e', marginBottom: '16px' }}>
            ✓ Atendidas ({atendidas.length})
          </div>
          {atendidas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9aa0a6', fontSize: '14px' }}>
              No hay solicitudes atendidas aún
            </div>
          ) : atendidas.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', border: '1px solid #e8eaed', borderRadius: '10px',
              marginBottom: '8px', background: '#fafafa', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#202124' }}>{s.nombre}</div>
                <div style={{ fontSize: '12px', color: '#5f6368' }}>{s.email}</div>
                <div style={{ fontSize: '12px', color: '#9aa0a6', marginTop: '2px' }}>
                  Atendida: {fmt(s.fecha_atendida)}
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#2d9a4e',
                background: '#dcfce7', border: '1px solid #86efac',
                borderRadius: '20px', padding: '3px 12px' }}>
                ✓ Atendida
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}