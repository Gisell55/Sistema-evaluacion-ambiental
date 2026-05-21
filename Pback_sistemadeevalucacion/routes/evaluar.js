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

/* ── GET /api/evaluar/pendientes/:tipo ── */
router.get('/pendientes/:tipo', verificarToken, async (req, res) => {
  try {
    const tipo = decodeURIComponent(req.params.tipo);
    const [proyectos] = await db.query(
      `SELECT p.id, p.nombre_proyecto, p.tipo_proyecto, p.base_calculo,
              p.ubicacion, p.responsables, p.fecha_creacion, p.estado,
              (SELECT COUNT(*) FROM evaluaciones_realizadas e WHERE e.proyecto_id = p.id) AS veces_evaluado
       FROM proyectos_evaluacion p
       WHERE p.tipo_proyecto = ? AND p.usuario_id = ?
       ORDER BY p.fecha_creacion DESC`,
      [tipo, req.usuario.id]
    );
    res.json({ proyectos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

/* ── GET /api/evaluar/detalle/:id ── */
router.get('/detalle/:id', verificarToken, async (req, res) => {
  try {
    const [[proyecto]] = await db.query(
      `SELECT * FROM proyectos_evaluacion WHERE id = ? AND usuario_id = ?`,
      [req.params.id, req.usuario.id]
    );
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });

    const [criterios] = await db.query(
      `SELECT * FROM proyecto_criterios WHERE proyecto_id = ? ORDER BY orden`,
      [proyecto.id]
    );
    for (const c of criterios) {
      const [params] = await db.query(
        `SELECT * FROM proyecto_parametros WHERE criterio_id = ? ORDER BY orden`, [c.id]
      );
      for (const p of params) {
        const [subs] = await db.query(
          `SELECT * FROM proyecto_subparametros WHERE parametro_id = ? ORDER BY orden`, [p.id]
        );
        p.subparametros = subs;
      }
      c.parametros = params;
    }
    proyecto.criterios = criterios;
    res.json({ proyecto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener detalle' });
  }
});

/* ── POST /api/evaluar/guardar ── */
router.post('/guardar', verificarToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { proyectoId, respuestas, puntajeTotal, puntajeMaximo } = req.body;
  console.log('Guardando evaluacion:', { proyectoId, puntajeTotal, puntajeMaximo, respuestas: respuestas?.length });
    const [ev] = await conn.query(
      `INSERT INTO evaluaciones_realizadas (proyecto_id, usuario_id, puntaje_total, puntaje_maximo)
       VALUES (?, ?, ?, ?)`,
      [proyectoId, req.usuario.id, puntajeTotal, puntajeMaximo]
    );
    const evalId = ev.insertId;

    for (const r of respuestas) {
      await conn.query(
        `INSERT INTO evaluacion_respuestas (evaluacion_id, subparametro_id, puntos_obtenidos)
         VALUES (?, ?, ?)`,
        [evalId, r.subparametroId, r.puntos]
      );
    }

    await conn.query(
      `UPDATE proyectos_evaluacion SET estado = 'evaluado' WHERE id = ?`,
      [proyectoId]
    );

    await conn.commit();
    res.status(201).json({ message: 'Evaluación guardada', id: evalId, puntajeTotal, puntajeMaximo });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al guardar evaluación' });
  } finally { conn.release(); }
});

module.exports = router;