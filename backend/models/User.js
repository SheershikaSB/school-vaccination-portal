// backend/models/User.js
const pool = require("../db");
const bcrypt = require("bcryptjs");

async function createAdminUser() {
  const username = "admin";
  const password = "admin123"; // Hardcoded for simplicity
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin'
      )
    `);

    const res = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (res.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (username, password, role) VALUES ($1, $2, 'admin')",
        [username, hashedPassword]
      );
      console.log("Admin user created: admin / admin123");
    }
  } catch (err) {
    console.error(err);
  }
}
// Call the function to create the admin user 
createAdminUser();

module.exports = {
  createAdminUser,
};