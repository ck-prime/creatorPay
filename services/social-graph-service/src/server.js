// services/social-graph-service/src/server.js
require("dotenv").config();
const express = require("express");
const graphRoutes = require("./routes/graph.routes");

const app = express();

app.use(express.json());
app.use("/social", graphRoutes);

// health check route
app.get("/", (req, res) => {
  res.send("Social Graph Service Running 🚀");
});

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log(`Social Graph Service running on port ${PORT}`);
});