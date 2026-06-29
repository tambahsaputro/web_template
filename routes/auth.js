const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/mail');
require('dotenv').config();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/forgot', (req, res) => res.render('forgot'));

router.get('/reset/:token', async (req, res) => {
  const user = await User.findOne({
    where: { resetPasswordToken: req.params.token }
  });
  if (!user) return res.send('Token tidak valid');
  res.render('reset', { token: req.params.token });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await User.create({ name, email, password });
    res.redirect('/login');
  } catch (err) {
    res.send('Email sudah terdaftar atau input tidak valid');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Email atau password salah');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/dashboard');
});

router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.send('Email tidak ditemukan');

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const link = `${req.protocol}://${req.get('host')}/reset/${token}`;
  await sendEmail(email, 'Reset Password Anda', `<a href="${link}">Klik untuk reset password</a>`);

  res.send('Link reset password telah dikirim ke email Anda (cek console untuk preview URL)');
});

router.post('/reset/:token', async (req, res) => {
  const { password } = req.body;
  const user = await User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { [Op.gt]: Date.now() }
    }
  });
  if (!user) return res.send('Token tidak valid atau kadaluarsa');

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
