const nodemailer = require('nodemailer');
require('dotenv').config();

// Konfigurasi GMAIL
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Pastikan App Password, tanpa spasi!
  },
});

const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: `"Web App" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,
  });
  console.log('✅ Email berhasil dikirim ke:', to);
  return info;
};

module.exports = sendEmail;