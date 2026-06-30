// Tangkap semua error
process.on('unhandledRejection', (reason) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

require('dotenv').config();
const { Client } = require('pg');

console.log("🔍 Testing koneksi database dengan pg Client...");
console.log("DB_URL:", process.env.DB_URL ? "ADA" : "TIDAK ADA");

if (!process.env.DB_URL) {
  console.error("❌ DB_URL tidak ditemukan!");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("📌 Mencoba connect...");

client.connect()
  .then(() => {
    console.log("✅ Koneksi BERHASIL!");
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log("✅ Query berhasil, waktu server:", res.rows[0].now);
    client.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi:", err.message);
    console.error("📋 Detail:", err);
    client.end();
    process.exit(1);
  });