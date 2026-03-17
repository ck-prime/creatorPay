// services/auth-service/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");

const { signup, login, forgotPassword, resetPassword, refresh, logout } = require("../controllers/auth.controller");
const { validate } = require("../middleware/validate.middleware");
const { loginRateLimiter } = require("../middleware/rateLimit.middleware");

const { signupSchema, loginSchema } = require("../validators/auth.validator");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", loginRateLimiter, validate(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticate, (req, res) => {

  return res.json({
    message: "Protected route accessed",
    user: req.user
  });

});

module.exports = router;