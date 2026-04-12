// gateway/src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");

const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh"
];

exports.authenticate = (req, res, next) => {
  try {
    if (publicRoutes.some(route => req.originalUrl.startsWith(route))) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header missing"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ DECODED:", decoded);
    req.user = decoded;
    delete req.headers["x-user-id"];
    req.headers["x-user-id"] = String(decoded.userId);

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
};