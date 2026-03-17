require("dotenv").config();
require("./workers/email.worker");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const pool = require("./config/db");
const { redis } = require("./config/redis"); // ✅ fixed
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
Health check
*/
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "auth-service",
    status: "running",
  });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});

/*
DB check (optional)
*/
pool.connect()
  .then(() => logger.info("Connected to PostgreSQL"))
  .catch(err => logger.error("Database connection error", err));