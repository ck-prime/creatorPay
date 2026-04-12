// services/user-service/src/server.jsrequire("dotenv").config();
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const userRoutes = require("./routes/user.routes");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/user", userRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "user-service", status: "running" });
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB error", err));