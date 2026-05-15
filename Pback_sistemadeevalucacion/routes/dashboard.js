const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

function verificarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido.' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    next();
  } catch { return res.status(403).json({ message: 'Token inválido.' }); }
}

/* GET /api/dashboard/stats */
router.get('/stats', verificarToken, async (req, res) => {
  try {
    const uid = req.usuario.id;

    // Total de evaluaciones realizadas por el usuario
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM evaluaciones_realizadas WHERE usuario_id = ?`,
      [uid]
    );

    // Puntuación promedio de todas las evaluaciones
    const [[{ promedio }]] = await db.query(
      `SELECT COALESCE(AVG(puntaje_total / puntaje_maximo * 100), 0) as promedio
       FROM evaluaciones_realizadas WHERE usuario_id = ?`,
      [uid]
    );

    // Ranking: todas las evaluaciones ordenadas de mayor a menor puntaje
    const [ranking] = await db.query(
      `SELECT er.id, er.puntaje_total, er.puntaje_maximo, er.fecha_evaluacion,
              p.nombre_proyecto, p.tipo_proyecto,
              ROUND(er.puntaje_total / er.puntaje_maximo * 100, 1) as porcentaje
       FROM evaluaciones_realizadas er
       JOIN proyectos_evaluacion p ON er.proyecto_id = p.id
       WHERE er.usuario_id = ?
       ORDER BY er.puntaje_total DESC`,
      [uid]
    );

    res.json({
      stats: {
        total: parseInt(total),
        promedio: parseFloat(promedio).toFixed(1),
      },
      ranking,
    });
  } catch (error) {
    console.error('Error en dashboard stats:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;