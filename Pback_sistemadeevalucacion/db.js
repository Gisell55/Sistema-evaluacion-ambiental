const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos la conexión con los datos del archivo .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // localhost
  user: process.env.DB_USER,         // root
  password: process.env.DB_PASSWORD, // tu contraseña de MySQL
  database: process.env.DB_NAME,     // sistema_ambiental
  waitForConnections: true,
  connectionLimit: 10,
});

// Verificamos que la conexión funcione al iniciar
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado a la base de datos MySQL correctamente');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con MySQL:', err.message);
  });

module.exports = pool;