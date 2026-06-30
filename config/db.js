const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log("📌 [db.js] Membaca parameter database...");
console.log("📌 DB_HOST:", process.env.DB_HOST || "TIDAK ADA");
console.log("📌 DB_NAME:", process.env.DB_NAME || "TIDAK ADA");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

console.log("✅ [db.js] Object Sequelize siap!");

module.exports = sequelize;