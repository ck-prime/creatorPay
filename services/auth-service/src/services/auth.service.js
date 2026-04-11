const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { generateResetToken } = require("../utils/token.util");
const { redis } = require("../config/redis");

const {
createUser,
findUserByEmail,
updatePassword,
findUserById,
} = require("../repositories/user.repository");

const resetRepo = require("../repositories/passwordReset.repository");

exports.signupUser = async (email, password) => {
const existingUser = await findUserByEmail(email);

if (existingUser) {
const error = new Error("Email already registered");
error.code = "EMAIL_EXISTS";
throw error;
}

const passwordHash = await bcrypt.hash(password, 6);

const user = await createUser(email, passwordHash);

return user;
};

// ================= LOGIN =================
exports.loginUser = async (email, password) => {
  let user;

  const normalizedEmail = email.toLowerCase();
  const cacheKey = `user:${normalizedEmail}`;

  const cachedUser = await redis.get(cacheKey);

  // ================= CACHE HANDLING =================
  if (cachedUser) {
    let parsed = null;

    try {
      parsed = JSON.parse(cachedUser);
    } catch (err) {
      console.error("❌ Invalid cache JSON, clearing...");
      await redis.del(cacheKey);
    }

    if (parsed && parsed.email) {
      user = await findUserByEmail(parsed.email);
    }
  }

  // ================= DB FALLBACK =================
  if (!user) {
    user = await findUserByEmail(normalizedEmail);

    if (!user) {
      const error = new Error("Invalid credentials");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    // ✅ Cache only safe data
    await redis.set(
      cacheKey,
      JSON.stringify({
        id: user.id,
        email: user.email
      }),
      "EX",
      300
    );
  }

  // ================= SAFETY CHECK =================
  if (!user || !user.password_hash) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  // ================= PASSWORD VERIFY =================
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  // ================= TOKEN GENERATION =================
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");

  await redis.set(
    `refresh_token:${refreshToken}`,
    user.id,
    "EX",
    7 * 24 * 60 * 60
  );

  return {
    accessToken,
    refreshToken
  };
};

// ================= REFRESH =================
exports.refreshAccessTokenDepricated = async (refreshToken) => {
const userId = await redis.get(`refresh_token:${refreshToken}`);

if (!userId) {
throw new Error("Invalid refresh token");
}

const accessToken = jwt.sign(
{ userId },
process.env.JWT_SECRET,
{ expiresIn: "15m" }
);

return accessToken;
};

exports.refreshAccessToken = async (oldRefreshToken) => {

  // 1️⃣ Check old token
  const userId = await redis.get(`refresh_token:${oldRefreshToken}`);

  if (!userId) {
    throw new Error("Invalid refresh token");
  }

  // 2️⃣ 🔥 DELETE OLD TOKEN (rotation step)
  await redis.del(`refresh_token:${oldRefreshToken}`);

  // 3️⃣ Generate NEW tokens
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const newRefreshToken = require("crypto")
    .randomBytes(40)
    .toString("hex");

  // 4️⃣ Store NEW refresh token
  await redis.set(
    `refresh_token:${newRefreshToken}`,
    userId,
    "EX",
    7 * 24 * 60 * 60
  );

  // 5️⃣ Return BOTH tokens
  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

// ================= LOGOUT =================
exports.logoutUser = async (refreshToken) => {
await redis.del(`refresh_token:${refreshToken}`);
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (email) => {
const rateLimitKey = `reset_email:${email.toLowerCase()}`;

const alreadyRequested = await redis.get(rateLimitKey);
if (alreadyRequested) return;

const user = await findUserByEmail(email.toLowerCase());
if (!user) return;

const { token, tokenHash } = generateResetToken();

const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

await resetRepo.createResetToken(
user.id,
tokenHash,
expiresAt
);

const emailQueue = require("../queues/email.queue");

await emailQueue.add("sendEmail", {
  to: user.email,
  subject: "Reset Password",
  html: `<h1>Your reset token: ${token}</h1>`
});

await redis.set(rateLimitKey, "1", "EX", 60);
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (token, newPassword) => {

const tokenHash = crypto
.createHash("sha256")
.update(token)
.digest("hex");

const storedToken = await resetRepo.findToken(tokenHash);

if (!storedToken) {
throw new Error("Invalid token");
}

if (new Date() > storedToken.expires_at) {
throw new Error("Token expired");
}

const passwordHash = await bcrypt.hash(newPassword, 10);

// ✅ Update password
await updatePassword(
storedToken.user_id,
passwordHash
);

// ✅ Delete token
await resetRepo.deleteToken(storedToken.id);

// 🔥 CRITICAL: invalidate cache
const user = await findUserById(storedToken.user_id);

if (user) {
await redis.del(`user:${user.email.toLowerCase()}`);
}

// 🔥 OPTIONAL (VERY IMPORTANT FOR SECURITY)
// invalidate all sessions
// (you can extend this later with user-session tracking)
};
