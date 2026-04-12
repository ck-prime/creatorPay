// services/user-service/src/utils/ensureDb.js
const { Client } = require("pg");

const ensureDatabase = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres",
  });

  try {
    await client.connect();

    const dbName = process.env.DB_NAME;

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

  } catch (err) {
    console.error("DB creation error", err);
    process.exit(1);
  } finally {
    await client.end();
  }
};

module.exports = ensureDatabase;