import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ModuloPage from './components/ModuloPage';
import CrearEvaluacion from './components/CrearEvaluacion';
import EvaluarProyectos from './components/EvaluarProyectos';
import Informes from './components/Informes';
import NuevaEvaluacion from './components/NuevaEvaluacion';
import AdminPanel from './components/AdminPanel';

function RutaProtegida({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/modulo" element={<RutaProtegida><ModuloPage /></RutaProtegida>} />
        <Route path="/crear-evaluacion" element={<RutaProtegida><CrearEvaluacion /></RutaProtegida>} />
        <Route path="/evaluar-proyectos" element={<RutaProtegida><EvaluarProyectos /></RutaProtegida>} />
        <Route path="/informes" element={<RutaProtegida><Informes /></RutaProtegida>} />
        <Route path="/nueva-evaluacion" element={<RutaProtegida><NuevaEvaluacion /></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida><AdminPanel /></RutaProtegida>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;