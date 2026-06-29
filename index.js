require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const sequelize = require('./config/db');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup view engine & layout default (untuk auth)
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // default layout (tanpa sidebar)
app.use(expressLayouts);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.redirect('/login'));
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Database sync & server start
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  });
});
