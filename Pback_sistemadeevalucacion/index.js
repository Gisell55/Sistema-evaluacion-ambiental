require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const evaluacionesRoutes = require('./routes/evaluaciones');
const crearEvaluacionRoutes = require('./routes/crear-evaluacion');
const evaluarRoutes = require('./routes/evaluar');
const informesRoutes = require('./routes/informes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => res.json({ mensaje: '🌿 API Sistema de Evaluación Ambiental', version: '1.0.0' }));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/crear-evaluacion', crearEvaluacionRoutes);
app.use('/api/evaluar', evaluarRoutes);
app.use('/api/informes', informesRoutes);

app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

app.listen(PORT, () => {
  console.log('\n🌿 ─────────────────────────────────────────');
  console.log(`   Sistema de Evaluación Ambiental`);
  console.log(`   Servidor en: http://localhost:${PORT}`);
  console.log('─────────────────────────────────────────────\n');
});