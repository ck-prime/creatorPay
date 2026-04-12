// gateway/src/server.js
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const { limiter } = require("./middleware/rateLimit.middleware");
const { authenticate } = require("./middleware/auth.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// 🔹 Logging
app.use(morgan("dev"));

// 🔹 Rate limiting
app.use(limiter);

// 🔹 JWT Auth (global)
app.use(authenticate);

// 🔹 Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// 🔹 Body parser (keep after proxy safety)
app.use(express.json());

app.listen(3000, () => {
  console.log("🚀 API Gateway running on port 3000");
});