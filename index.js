require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

console.log("📌 [index.js] Memulai inisialisasi...");

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');

const sequelize = require('./config/db');
console.log("✅ [index.js] Sequelize berhasil diimport");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("✅ [index.js] Server sedang diinisialisasi...");

app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.redirect('/login'));
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/users', usersRoutes);

console.log("✅ [index.js] Routes sudah terdaftar!");
console.log("📌 [index.js] Mencoba sync database...");

// Gunakan try-catch di sekitar sync
(async function startServer() {
  try {
    console.log("📌 [index.js] Memulai try-catch...");
    await sequelize.sync({ force: false, alter: true });
    console.log("✅ [index.js] Database berhasil disinkronisasi!");
    
    app.listen(PORT, () => {
      console.log(`✅ [index.js] Server berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ [index.js] ERROR:", err.message);
    console.error("📋 Detail lengkap:", err);
    process.exit(1);
  }
})();