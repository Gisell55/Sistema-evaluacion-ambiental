const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { notificarAdmin, enviarContrasenaTemp } = require('../utils/mailer');
const router = express.Router();

function verificarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido.' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    next();
  } catch { return res.status(403).json({ message: 'Token inválido.' }); }
}

function verificarAdmin(req, res, next) {
  if (!req.usuario.es_admin) return res.status(403).json({ message: 'Acceso solo para administradores.' });
  next();
}

/* POST /api/recuperacion/solicitar */
router.post('/solicitar', async (req, res) => {
  try {
    const { email } = req.body;
    const [[usuario]] = await db.query(
      'SELECT id, nombre, email FROM usuarios WHERE email = ?', [email]
    );
    if (!usuario) return res.status(404).json({ message: 'No existe una cuenta con ese correo.' });

    const [[pendiente]] = await db.query(
      `SELECT id FROM solicitudes_recuperacion
       WHERE usuario_id = ? AND estado = 'pendiente'`, [usuario.id]
    );
    if (pendiente) return res.status(400).json({
      message: 'Ya tienes una solicitud pendiente. El administrador la atenderá pronto.'
    });

    await db.query(
      `INSERT INTO solicitudes_recuperacion (usuario_id, email, nombre) VALUES (?, ?, ?)`,
      [usuario.id, usuario.email, usuario.nombre]
    );

    await notificarAdmin(usuario.nombre, usuario.email);
    res.json({ message: 'Solicitud enviada. El administrador te contactará pronto.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
});

/* GET /api/recuperacion/solicitudes */
router.get('/solicitudes', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const [solicitudes] = await db.query(
      `SELECT * FROM solicitudes_recuperacion ORDER BY estado ASC, fecha_solicitud DESC`
    );
    res.json({ solicitudes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener solicitudes.' });
  }
});

/* GET /api/recuperacion/usuarios */
router.get('/usuarios', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const [usuarios] = await db.query(
      `SELECT id, nombre, email, nacionalidad, ciudad, rol, empresa, tipo_empresa, fecha_registro
       FROM usuarios
       WHERE es_admin = 0 OR es_admin IS NULL
       ORDER BY fecha_registro DESC`
    );
    res.json({ usuarios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
});

/* POST /api/recuperacion/resetear/:id */
router.post('/resetear/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const [[solicitud]] = await db.query(
      `SELECT * FROM solicitudes_recuperacion WHERE id = ? AND estado = 'pendiente'`,
      [req.params.id]
    );
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada.' });

    const contrasenaTemporal = 'Temp' + Math.floor(1000 + Math.random() * 9000);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasenaTemporal, salt);

    await db.query('UPDATE usuarios SET password = ? WHERE id = ?',
      [hash, solicitud.usuario_id]
    );
    await db.query(
      `UPDATE solicitudes_recuperacion SET estado = 'atendida', fecha_atendida = NOW() WHERE id = ?`,
      [req.params.id]
    );

    await enviarContrasenaTemp(solicitud.email, solicitud.nombre, contrasenaTemporal);
    res.json({ message: `Contraseña reseteada y enviada a ${solicitud.email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al resetear contraseña.' });
  }
});

module.exports = router;