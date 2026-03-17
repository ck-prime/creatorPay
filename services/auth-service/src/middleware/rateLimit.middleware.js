// services/auth-service/src/middleware/rateLimit.middleware.js
const { client } = require("../config/redis");

exports.loginRateLimiter = async (req, res, next) => {
  try {

    const ip = req.ip;
    const key = `login_attempt:${ip}`;

    const attempts = await client.get(key);

    if (attempts && attempts >= 5) {
      return res.status(429).json({
        error: "Too many login attempts. Try again later."
      });
    }

    await client.incr(key);
    await client.expire(key, 60);

    next();

  } catch (error) {
    console.error(error);
    next();
  }
};