// services/user-service/src/middleware/auth.middleware.js
exports.extractUser = (req, res, next) => {
  const userId = parseInt(req.headers["x-user-id"]);

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  req.user = { userId };

  next();
};