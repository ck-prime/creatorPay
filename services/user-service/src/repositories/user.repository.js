// services/user-service/src/repositories/user.repository.js
const pool = require("../config/db");

exports.findUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};