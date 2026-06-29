const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.redirect('/login');
    if (user.role !== 'admin') {
      return res.status(403).send('Akses ditolak. Hanya admin.');
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect('/login');
  }
};
