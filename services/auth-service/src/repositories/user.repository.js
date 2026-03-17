// services/auth-service/src/repositories/user.repository.js
const pool = require("../config/db");

exports.createUser = async (email, passwordHash) => {

  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
  `;

  const values = [email, passwordHash];

  const result = await pool.query(query, values);

  return result.rows[0];
};


exports.findUserByEmail = async (email) => {

  const query = `
    SELECT * FROM users WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};


exports.updatePassword = async (userId, passwordHash) => {

  const query = `
    UPDATE users
    SET password_hash = $1
    WHERE id = $2
    RETURNING id
  `;

  const result = await pool.query(query, [passwordHash, userId]);

  return result.rows[0];
};