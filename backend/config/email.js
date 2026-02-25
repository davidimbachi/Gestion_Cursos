import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/confirmar/${token}`;
  await transporter.sendMail({
    from: '"SENA Klassroom" <no-reply@tudominio.com>',
    to,
    subject: 'Confirma tu correo electrónico',
    html: `
      <h2>Bienvenido a Klassroom</h2>
      <p>Por favor confirma tu correo haciendo clic en el siguiente enlace:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Este enlace expira en 24 horas.</p>
    `,
  });
};

export const sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: '"SENA Klassroom" <no-reply@tudominio.com>',
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <h2>Recupera tu contraseña</h2>
      <p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña.</p>
      <p>El enlace expira en 1 hora.</p>
    `,
  });
};