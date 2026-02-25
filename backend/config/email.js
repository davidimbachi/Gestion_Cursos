import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,      // Ejemplo: smtp.gmail.com
  port: process.env.EMAIL_PORT,      // Ejemplo: 587
  secure: false, // true para 465
  auth: {
    user: process.env.EMAIL_USER,    // Tu correo
    pass: process.env.EMAIL_PASS,    // Tu contraseña (o App Password)
  },
});

export const sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const mailOptions = {
    from: '"SENA Klassroom" <no-reply@tudominio.com>',
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <h2>Recupera tu contraseña</h2>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no solicitaste esto, ignora este correo.</p>
      <p>El enlace expira en 1 hora.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};