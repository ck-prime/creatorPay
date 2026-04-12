// services/user-service/src/routes/user.routes.js
const express = require("express");
const router = express.Router();

const { getMe, createUser, getUsersBulk } = require("../controllers/user.controller");

router.get("/me", getMe);
router.post("/", createUser);
router.post("/bulk", getUsersBulk);

module.exports = router;