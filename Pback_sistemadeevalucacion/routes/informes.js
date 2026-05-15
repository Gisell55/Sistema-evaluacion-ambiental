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

/* GET /api/informes/lista/:tipo */
router.get('/lista/:tipo', verificarToken, async (req, res) => {
  try {
    const tipo = decodeURIComponent(req.params.tipo);
    const [evaluaciones] = await db.query(
      `SELECT er.id, er.puntaje_total, er.puntaje_maximo, er.fecha_evaluacion,
              p.nombre_proyecto, p.tipo_proyecto, p.ubicacion, p.responsables,
              p.base_calculo, p.id as proyecto_id
       FROM evaluaciones_realizadas er
       JOIN proyectos_evaluacion p ON er.proyecto_id = p.id
       WHERE er.usuario_id = ? AND p.tipo_proyecto = ?
       ORDER BY er.fecha_evaluacion DESC`,
      [req.usuario.id, tipo]
    );
    res.json({ evaluaciones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener informes' });
  }
});

/* GET /api/informes/detalle/:evaluacionId */
router.get('/detalle/:evaluacionId', verificarToken, async (req, res) => {
  try {
    const evalId = req.params.evaluacionId;

    // Datos generales de la evaluación
    const [[evaluacion]] = await db.query(
      `SELECT er.id, er.puntaje_total, er.puntaje_maximo, er.fecha_evaluacion,
              p.nombre_proyecto, p.tipo_proyecto, p.ubicacion, p.responsables,
              p.descripcion, p.base_calculo, p.id as proyecto_id
       FROM evaluaciones_realizadas er
       JOIN proyectos_evaluacion p ON er.proyecto_id = p.id
       WHERE er.id = ? AND er.usuario_id = ?`,
      [evalId, req.usuario.id]
    );
    if (!evaluacion) return res.status(404).json({ message: 'Evaluación no encontrada' });

    // Criterios del proyecto
    const [criterios] = await db.query(
      `SELECT * FROM proyecto_criterios WHERE proyecto_id = ? ORDER BY orden`,
      [evaluacion.proyecto_id]
    );

    for (const c of criterios) {
      const [params] = await db.query(
        `SELECT * FROM proyecto_parametros WHERE criterio_id = ? ORDER BY orden`, [c.id]
      );
      c.puntaje_obtenido = 0;

      for (const p of params) {
        const [subs] = await db.query(
          `SELECT s.id, s.nombre, s.puntos, s.porcentaje,
                  COALESCE(r.puntos_obtenidos, 0) as puntos_obtenidos,
                  CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as seleccionado
           FROM proyecto_subparametros s
           LEFT JOIN evaluacion_respuestas r ON r.subparametro_id = s.id AND r.evaluacion_id = ?
           WHERE s.parametro_id = ?
           ORDER BY s.orden`,
          [evalId, p.id]
        );
        p.subparametros = subs;

        // El subparámetro seleccionado aporta sus puntos al criterio
        const seleccionado = subs.find(s => s.seleccionado);
        p.puntos_obtenidos = seleccionado ? seleccionado.puntos_obtenidos : 0;
        c.puntaje_obtenido += p.puntos_obtenidos;
      }
      c.parametros = params;
    }

    evaluacion.criterios = criterios;
    res.json({ evaluacion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener detalle' });
  }
});

module.exports = router;