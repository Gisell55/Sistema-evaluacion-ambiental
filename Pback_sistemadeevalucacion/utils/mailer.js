const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const notificarAdmin = async (nombreUsuario, emailUsuario) => {
  await transporter.sendMail({
    from: `"Sistema Evaluación" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_ADMIN,
    subject: '🔔 Nueva solicitud de recuperación de contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2d9a4e;">Nueva Solicitud de Recuperación</h2>
        <p>El siguiente usuario ha solicitado recuperar su contraseña:</p>
        <div style="background: #f0faf3; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Nombre:</strong> ${nombreUsuario}</p>
          <p><strong>Correo:</strong> ${emailUsuario}</p>
        </div>
        <p>Ingresa al panel de administrador para atender esta solicitud.</p>
      </div>
    `,
  });
};

const enviarContrasenaTemp = async (emailUsuario, nombreUsuario, contrasenaTemporal) => {
  await transporter.sendMail({
    from: `"Sistema Evaluación" <${process.env.EMAIL_USER}>`,
    to: emailUsuario,
    subject: '🔑 Tu contraseña temporal - Sistema Evaluación Ambiental',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2d9a4e;">Contraseña Temporal</h2>
        <p>Hola <strong>${nombreUsuario}</strong>,</p>
        <p>El administrador ha atendido tu solicitud. Tu contraseña temporal es:</p>
        <div style="background: #f0faf3; border: 2px solid #2d9a4e; padding: 20px;
             border-radius: 8px; text-align: center; margin: 16px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #1e7a3a; letter-spacing: 3px;">
            ${contrasenaTemporal}
          </span>
        </div>
        <p style="color: #e07b00;">⚠️ Por seguridad, cambia esta contraseña después de iniciar sesión.</p>
      </div>
    `,
  });
};

module.exports = { notificarAdmin, enviarContrasenaTemp };