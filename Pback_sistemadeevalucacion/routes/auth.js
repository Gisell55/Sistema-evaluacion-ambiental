const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, nacionalidad, ciudad, rol, empresa, tipoEmpresa } = req.body;

    if (!nombre || !email || !password || !nacionalidad || !ciudad || !rol || !empresa || !tipoEmpresa) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const [usuariosExistentes] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese correo electrónico' });
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/;
    if (!regexPassword.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe tener 8-15 caracteres, una mayúscula, una minúscula y un número' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [resultado] = await db.query(
      `INSERT INTO usuarios (nombre, email, password, nacionalidad, ciudad, rol, empresa, tipo_empresa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, passwordHash, nacionalidad, ciudad, rol, empresa, tipoEmpresa]
    );

    console.log(`✅ Usuario registrado: ${email}`);
    res.status(201).json({ message: 'Cuenta creada exitosamente', usuario: { id: resultado.insertId, nombre, email, rol } });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });

    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });

    const usuario = usuarios[0];
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });

const token = jwt.sign(
  { id: usuario.id, email: usuario.email, rol: usuario.rol, es_admin: usuario.es_admin },
  process.env.JWT_SECRET || 'secreto_temporal',
  { expiresIn: '8h' }
);

    console.log(`✅ Login exitoso: ${email}`);
    res.json({
      message: 'Inicio de sesión exitoso', token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, empresa: usuario.empresa, es_admin: usuario.es_admin }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;