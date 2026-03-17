// services/auth-service/src/services/auth.service.js
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { generateResetToken } = require("../utils/token.util");
const { sendMail } = require("../utils/mail.util");

const { createUser, findUserByEmail, updatePassword } = require("../repositories/user.repository");
const userRepo = require("../repositories/user.repository");
const resetRepo = require("../repositories/passwordReset.repository");

exports.signupUser = async (email, password) => {

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Email already registered");
    error.code = "EMAIL_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUser(email, passwordHash);

  return user;
};

exports.loginUserDepricated = async (email, password) => {

  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};

exports.forgotPasswordDepricated = async (email) => {

  const user = await userRepo.findUserByEmail(email);

  if (!user) {
    return;
  }

  const { token, tokenHash } = generateResetToken();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await resetRepo.createResetToken(
    user.id,
    tokenHash,
    expiresAt
  );

  console.log("RESET TOKEN:", token);

};

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

  await userRepo.updatePassword(
    storedToken.user_id,
    passwordHash
  );

  await resetRepo.deleteToken(storedToken.id);

};

exports.loginUser = async (email, password) => {

  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");

  const redis = require("../config/redis").client;

  await redis.set(
    `refresh_token:${refreshToken}`,
    user.id,
    {
      EX: 7 * 24 * 60 * 60 // 7 days
    }
  );

  return {
    accessToken,
    refreshToken
  };

};

exports.refreshAccessToken = async (refreshToken) => {

  const redis = require("../config/redis").client;

  const userId = await redis.get(`refresh_token:${refreshToken}`);

  if (!userId) {
    throw new Error("Invalid refresh token");
  }

  const user = await findUserByEmail;

  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return accessToken;

};

exports.logoutUser = async (refreshToken) => {

  const redis = require("../config/redis").client;

  await redis.del(`refresh_token:${refreshToken}`);

};

exports.forgotPassword = async (email) => {
  try{
    const user = await userRepo.findUserByEmail(email);

    if (!user) return;

    const { token, tokenHash } = generateResetToken();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await resetRepo.createResetToken(
      user.id,
      tokenHash,
      expiresAt
    );

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // await sendMail({
    //   to: email,
    //   subject: "CreatorPay Password Reset",
    //   html: `
    //     <h2>Password Reset Request</h2>
    //     <p>You requested to reset your password.</p>

    //     <p>
    //       <a href="${resetLink}">
    //         Reset Password
    //       </a>
    //     </p>

    //     <p>This link will expire in 15 minutes.</p>

    //     <p>If you did not request this, please ignore.</p>
    //   `
    // });

    const emailQueue = require("../queues/email.queue");

    await emailQueue.add("sendEmail", {
      to: email,
      subject: "CreatorPay Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset password</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });
  }catch (error) {
    logger.error("forgot password failed", error);
}

  

};