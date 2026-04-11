// services/auth-service/src/utils/ensureDb.js
const { Client } = require("pg");
const logger = require("./logger");

const ensureDatabase = async () => {

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres" // connect to default DB
  });

  try {
    await client.connect();

    const dbName = process.env.DB_NAME;

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      logger.info(`Database ${dbName} does not exist. Creating...`);

      await client.query(`CREATE DATABASE ${dbName}`);

      logger.info(`Database ${dbName} created`);
    } else {
      logger.info(`Database ${dbName} already exists`);
    }

  } catch (err) {
    logger.error("Error ensuring database", err);
    process.exit(1);
  } finally {
    await client.end();
  }

};

module.exports = ensureDatabase;