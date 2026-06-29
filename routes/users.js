const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Middleware: semua route di sini harus login
router.use(auth);

// Halaman daftar user
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.render('users/index', { 
      users, 
      user: req.user,
      layout: 'layout-dashboard' 
    });
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

// Halaman tambah user
router.get('/create', (req, res) => {
  res.render('users/create', { 
    user: req.user,
    layout: 'layout-dashboard' 
  });
});

// Proses tambah user
router.post('/create', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await User.create({ name, email, password, role });
    res.redirect('/users');
  } catch (err) {
    res.send('Gagal menambah user: ' + err.message);
  }
});

// Halaman edit user
router.get('/edit/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.send('User tidak ditemukan');
    res.render('users/edit', { 
      user, 
      currentUser: req.user,
      layout: 'layout-dashboard' 
    });
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

// Proses update user
router.post('/edit/:id', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.send('User tidak ditemukan');

    user.name = name;
    user.email = email;
    user.role = role;
    if (password && password.length > 0) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.redirect('/users');
  } catch (err) {
    res.send('Gagal update: ' + err.message);
  }
});

// Proses hapus user
router.get('/delete/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.send('User tidak ditemukan');
    await user.destroy();
    res.redirect('/users');
  } catch (err) {
    res.send('Gagal hapus: ' + err.message);
  }
});

module.exports = router;
