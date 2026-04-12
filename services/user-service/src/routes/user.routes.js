// services/user-service/src/routes/user.routes.js
const express = require("express");
const router = express.Router();

const { getMe, createUser } = require("../controllers/user.controller");

router.get("/me", getMe);
router.post("/", createUser);

module.exports = router;