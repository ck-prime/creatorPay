// services/user-service/src/repositories/user.repository.js
const pool = require("../config/db");

exports.findUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

exports.getUsersByIds = async (userIds) => {
  const query = `
    SELECT id, username, display_name, profile_picture
    FROM users
    WHERE id = ANY($1)
  `;

  const result = await pool.query(query, [userIds]);

  return result.rows;
};