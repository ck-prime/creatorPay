// services/auth-service/src/server.js
require("dotenv").config();
require("./workers/email.worker");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const pool = require("./config/db");
const { connectRedis } = require("./config/redis");
const logger = require("./utils/logger");

const app = express();

/*
Middleware
*/
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRoutes);

/*
Health check route
*/
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "auth-service",
    status: "running",
  });
});

const PORT = process.env.PORT || 4001;
connectRedis();

app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});


/*
Db setup
*/
pool.connect()
  .then(() => {
    logger.info("Connected to PostgreSQL");
  })
  .catch(err => {
    logger.error("Database connection error", err);
  });

