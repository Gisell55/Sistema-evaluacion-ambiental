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

/* POST /api/crear-evaluacion/guardar */
router.post('/guardar', verificarToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { tipoProyecto, nombreProyecto, descripcion, ubicacion, responsables, baseCalculo, criterios } = req.body;

    const [proy] = await conn.query(
      `INSERT INTO proyectos_evaluacion (usuario_id, tipo_proyecto, nombre_proyecto, descripcion, ubicacion, responsables, base_calculo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.usuario.id, tipoProyecto, nombreProyecto, descripcion, ubicacion, responsables, baseCalculo]
    );
    const proyId = proy.insertId;

    for (let i = 0; i < criterios.length; i++) {
      const c = criterios[i];
      const [crit] = await conn.query(
        `INSERT INTO proyecto_criterios (proyecto_id, nombre, porcentaje, puntos, orden) VALUES (?,?,?,?,?)`,
        [proyId, c.nombre, c.porcentaje, c.puntos, i]
      );
      for (let j = 0; j < c.parametros.length; j++) {
        const p = c.parametros[j];
        const [param] = await conn.query(
          `INSERT INTO proyecto_parametros (criterio_id, nombre, orden) VALUES (?,?,?)`,
          [crit.insertId, p.nombre, j]
        );
        for (let k = 0; k < p.subparametros.length; k++) {
          const s = p.subparametros[k];
          await conn.query(
            `INSERT INTO proyecto_subparametros (parametro_id, nombre, porcentaje, puntos, orden) VALUES (?,?,?,?,?)`,
            [param.insertId, s.nombre, s.porcentaje, s.puntos, k]
          );
        }
      }
    }

    await conn.commit();
    console.log(`Evaluacion guardada: ${nombreProyecto}`);
    res.status(201).json({ message: 'Evaluación guardada exitosamente', id: proyId });
  } catch (err) {
    await conn.rollback();
    console.error('Error guardando evaluacion:', err);
    res.status(500).json({ message: 'Error al guardar la evaluación' });
  } finally { conn.release(); }
});

/* GET /api/crear-evaluacion/lista/:tipo */
router.get('/lista/:tipo', verificarToken, async (req, res) => {
  try {
    const [proyectos] = await db.query(
      `SELECT id, nombre_proyecto, tipo_proyecto, base_calculo, estado, fecha_creacion
       FROM proyectos_evaluacion WHERE usuario_id = ? AND tipo_proyecto = ?
       ORDER BY fecha_creacion DESC`,
      [req.usuario.id, decodeURIComponent(req.params.tipo)]
    );
    res.json({ proyectos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

/* GET /api/crear-evaluacion/detalle/:id */
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

module.exports = router;