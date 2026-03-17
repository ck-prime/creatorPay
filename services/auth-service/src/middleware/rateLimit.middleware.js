// services/auth-service/src/middleware/rateLimit.middleware.js

const { redis } = require("../config/redis");

exports.loginRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const email = req.body.email || "unknown";

    // 🔥 Better key (IP + email)
    const key = `login_attempt:${ip}:${email}`;

    // 🔥 Atomic increment
    const attempts = await redis.incr(key);

    // 🔥 Set expiry ONLY on first attempt
    if (attempts === 1) {
      await redis.expire(key, 60); // 60 sec window
    }

    // 🔥 Block if limit exceeded
    if (attempts > 5) {
      return res.status(429).json({
        error: "Too many login attempts. Try again later.",
      });
    }

    next();

  } catch (error) {
    console.error("Rate limiter error:", error);
    next(); // don't block request on Redis failure
  }
};