const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  // Kirim data user dan tentukan layout dashboard
  res.render('dashboard', { 
    user: req.user,
    layout: 'layout-dashboard' // <-- kunci: pakai layout dashboard
  });
});

module.exports = router;
