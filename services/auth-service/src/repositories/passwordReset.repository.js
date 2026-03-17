// services/auth-service/src/repositories/passwordReset.repository.js
const pool = require("../config/db");

exports.createResetToken = async (userId, tokenHash, expiresAt) => {

  const query = `
    INSERT INTO password_reset_tokens
    (user_id, token_hash, expires_at)
    VALUES ($1,$2,$3)
  `;

  const values = [userId, tokenHash, expiresAt];

  await pool.query(query, values);

};


exports.findToken = async (tokenHash) => {

  const query = `
    SELECT * FROM password_reset_tokens
    WHERE token_hash = $1
  `;

  const result = await pool.query(query, [tokenHash]);

  return result.rows[0];

};


exports.deleteToken = async (id) => {

  const query = `
    DELETE FROM password_reset_tokens
    WHERE id = $1
  `;

  await pool.query(query, [id]);

};