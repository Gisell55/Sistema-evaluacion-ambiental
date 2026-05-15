const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Middleware para verificar token JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido.' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
}

/* ─────────────────────────────────────────────
   POST /api/evaluaciones/crear
───────────────────────────────────────────── */
router.post('/crear', verificarToken, async (req, res) => {
  try {
    const { nombreProyecto, tipoProyecto } = req.body;
    const usuarioId = req.usuario.id;

    if (!nombreProyecto || !tipoProyecto) {
      return res.status(400).json({ message: 'El nombre y tipo de proyecto son obligatorios' });
    }

    const [resultado] = await db.query(
      `INSERT INTO evaluaciones (nombre_proyecto, tipo_proyecto, usuario_id)
       VALUES (?, ?, ?)`,
      [nombreProyecto, tipoProyecto, usuarioId]
    );

    console.log(`✅ Evaluación creada: ${nombreProyecto} por usuario ${usuarioId}`);

    res.status(201).json({
      message: 'Evaluación creada exitosamente',
      evaluacion: {
        id: resultado.insertId,
        nombreProyecto,
        tipoProyecto,
      }
    });
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/* ─────────────────────────────────────────────
   GET /api/evaluaciones/mis-evaluaciones
───────────────────────────────────────────── */
router.get('/mis-evaluaciones', verificarToken, async (req, res) => {
  try {
    const [evaluaciones] = await db.query(
      `SELECT id, nombre_proyecto, tipo_proyecto, fecha_creacion
       FROM evaluaciones WHERE usuario_id = ?
       ORDER BY fecha_creacion DESC`,
      [req.usuario.id]
    );
    res.json({ evaluaciones });
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;