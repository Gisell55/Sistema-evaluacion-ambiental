import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('solicitudes');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const pdfContentRef = useRef(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const token = localStorage.getItem('token');
      const resSolicitudes = await axios.get(`${API_URL}/api/recuperacion/solicitudes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const resUsuarios = await axios.get(`${API_URL}/api/recuperacion/usuarios`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSolicitudes(resSolicitudes.data.solicitudes);
      setUsuarios(resUsuarios.data.usuarios);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetear = async (id, nombre) => {
    if (!window.confirm(`¿Resetear la contraseña de ${nombre}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/recuperacion/resetear/${id}`, {},
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
  
const generarPDF = async () => {
  if (!pdfContentRef.current) {
    console.error('pdfContentRef.current es null');
    return;
  }
  
  setGenerandoPDF(true);
  try {
    const element = pdfContentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 277;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

    let heightLeft = imgHeight - 190;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 190;
    }

    pdf.save(`Historial_Usuarios_${new Date().getTime()}.pdf`);
  } catch (err) {
    console.error('Error:', err);
    alert('Error al generar PDF: ' + err.message);
  } finally {
    setGenerandoPDF(false);
  }
};

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

      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e8eaed' }}>
          <button onClick={() => setTab('solicitudes')}
            style={{ padding: '12px 20px', fontSize: '14px', fontWeight: '600',
              color: tab === 'solicitudes' ? '#2d9a4e' : '#5f6368',
              background: 'none', border: 'none', borderBottom: tab === 'solicitudes' ? '3px solid #2d9a4e' : 'none',
              cursor: 'pointer', marginBottom: '-2px' }}>
            Solicitudes de Recuperación
          </button>
          <button onClick={() => setTab('usuarios')}
            style={{ padding: '12px 20px', fontSize: '14px', fontWeight: '600',
              color: tab === 'usuarios' ? '#2d9a4e' : '#5f6368',
              background: 'none', border: 'none', borderBottom: tab === 'usuarios' ? '3px solid #2d9a4e' : 'none',
              cursor: 'pointer', marginBottom: '-2px' }}>
            Historial de Usuarios
          </button>
        </div>

        {tab === 'solicitudes' && (
          <div>
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
          </div>
        )}

       {tab === 'usuarios' && (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#202124', marginBottom: '6px' }}>
          Historial de Usuarios Registrados
        </h2>
        <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '0' }}>
          Visualiza todos los usuarios que se han registrado en la plataforma
        </p>
      </div>
      <button
        onClick={generarPDF}
        disabled={generandoPDF}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px',
          borderRadius: '10px', background: generandoPDF ? '#e8eaed' : 'linear-gradient(135deg,#2d9a4e,#1e7a3a)',
          color: generandoPDF ? '#9aa0a6' : '#fff', fontWeight: '700', fontSize: '13px', border: 'none',
          cursor: generandoPDF ? 'not-allowed' : 'pointer', boxShadow: generandoPDF ? 'none' : '0 4px 12px rgba(45,154,78,0.3)',
          whiteSpace: 'nowrap' }}>
        📄 {generandoPDF ? 'Generando PDF...' : 'Descargar PDF'}
      </button>
    </div>

    {loading ? (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9aa0a6' }}>Cargando usuarios...</div>
    ) : usuarios.length === 0 ? (
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
        padding: '60px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#9aa0a6' }}>
          No hay usuarios registrados aún
        </div>
      </div>
    ) : (
      <>
        {/* Contenido para PDF */}
        <div ref={pdfContentRef} style={{ background: '#fff', padding: '20px', position: 'absolute', left: '-9999px', top: '-9999px', width: '1200px' }}>
          <div style={{ textAlign: 'center', paddingBottom: '16px', marginBottom: '16px', borderBottom: '2px solid #e8eaed' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#202124', marginBottom: '4px' }}>
              Sistema de Evaluación Ambiental -UNIMETA
            </div>
            <div style={{ fontSize: '11px', color: '#5f6368' }}>
              Historial de Usuarios Registrados
            </div>
            <div style={{ fontSize: '10px', color: '#9aa0a6', marginTop: '6px' }}>
              Generado: {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#f0faf3', borderRadius: '8px', borderLeft: '4px solid #2d9a4e' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2d9a4e' }}>
              Total de usuarios registrados: {usuarios.length}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e8eaed' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Nombre</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Nacionalidad</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Ciudad</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Rol</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Empresa</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Tipo Empresa</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9aa0a6', textTransform: 'uppercase' }}>Fecha Registro</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, idx) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e8eaed', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#202124', fontWeight: '500' }}>{u.nombre}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#5f6368' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#5f6368' }}>{u.nacionalidad || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#5f6368' }}>{u.ciudad || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600' }}>{u.rol}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#5f6368' }}>{u.empresa || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#5f6368' }}>{u.tipo_empresa || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: '#9aa0a6' }}>{fmt(u.fecha_registro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e8eaed', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#9aa0a6' }}>
              Este documento fue generado automáticamente por el Sistema de Evaluación Ambiental -UNIMETA
            </div>
          </div>
        </div>

        {/* Tabla visible en pantalla */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e8eaed' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Nombre</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Nacionalidad</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Ciudad</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Rol</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Empresa</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Tipo Empresa</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase' }}>Fecha Registro</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, idx) => (
                  <tr key={u.id} style={{ borderBottom: idx < usuarios.length - 1 ? '1px solid #f1f3f4' : 'none', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#202124', fontWeight: '500' }}>{u.nombre}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5f6368' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5f6368' }}>{u.nacionalidad || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5f6368' }}>{u.ciudad || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>
                      <span style={{ background: u.rol === 'evaluador' ? '#dcfce7' : '#dbeafe', color: u.rol === 'evaluador' ? '#14532d' : '#1e3a8a', borderRadius: '20px', padding: '3px 10px', display: 'inline-block' }}>
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5f6368' }}>{u.empresa || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5f6368' }}>{u.tipo_empresa || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9aa0a6' }}>{fmt(u.fecha_registro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '16px 24px', background: '#f8f9fa', borderTop: '1px solid #e8eaed', fontSize: '13px', fontWeight: '600', color: '#5f6368' }}>
            Total: {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}
          </div>
        </div>
      </>
    )}
  </div>
)}
      </main>
    </div>
  );
}