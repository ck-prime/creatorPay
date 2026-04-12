// services/user-service/src/scripts/setup.js
require("dotenv").config();

const ensureDatabase = require("../utils/ensureDb");
const { execSync } = require("child_process");

(async () => {
  await ensureDatabase();

  console.log("Running migrations...");

  execSync("npx node-pg-migrate up", {
    stdio: "inherit",
  });

  console.log("Setup complete");
})();