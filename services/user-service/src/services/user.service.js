// services/user-service/src/services/user.service.js
const pool = require("../config/db");
const { findUserById } = require("../repositories/user.repository");

exports.getUserProfile = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};



const generateUsername = async (baseUsername) => {
  let username = baseUsername;
  let count = 0;

  while (true) {
    const checkQuery = `SELECT 1 FROM users WHERE username = $1`;
    const exists = await pool.query(checkQuery, [username]);

    if (exists.rowCount === 0) {
      return username;
    }

    count++;
    username = `${baseUsername}${count}`;
  }
};

exports.createUserProfile = async (id, email) => {
  const baseUsername = email.split("@")[0];

  const username = await generateUsername(baseUsername);

  const query = `
    INSERT INTO users (id, email, username)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO NOTHING
    RETURNING *
  `;

  const result = await pool.query(query, [id, email, username]);

  return result.rows[0];
};