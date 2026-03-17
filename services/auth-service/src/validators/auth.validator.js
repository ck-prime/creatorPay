// services/auth-service/src/validators/auth.validator.js
const { z } = require("zod");

exports.signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});