// services/auth-service/src/utils/token.util.js
const crypto = require("crypto");

exports.generateResetToken = () => {

  const token = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return {
    token,
    tokenHash
  };

};