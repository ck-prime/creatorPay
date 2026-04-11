// services/auth-service/src/controllers/auth.controller.js
const { signupUser, loginUser, forgotPassword, resetPassword, refreshAccessToken, logoutUser } = require("../services/auth.service");

exports.signup = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await signupUser(email, password);

    return res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {

    if (error.code === "EMAIL_EXISTS") {
      return res.status(400).json({
        error: "Email already registered"
      });
    }

    console.error(error);

    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

exports.logindepricated = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.json({
      message: "Login successful",
      token: result.token
    });

  } catch (error) {

    if (error.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    console.error(error);

    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    await forgotPassword(email);

    res.json({
      message:
        "If this email exists, a reset link has been sent"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

exports.resetPassword = async (req, res) => {

  try {

    const { token, newPassword } = req.body;

    await resetPassword(
      token,
      newPassword
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }

};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.json({
      message: "Login successful",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (error) {

    if (error.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    res.status(500).json({
      stack: error.stack,
      error: "Internal Server Error"
    });
  }
};

exports.refresh = async (req, res) => {

  try {
    console.log("REFRESH BODY:", req.body);
    const { refreshToken } = req.body;

    const result = await refreshAccessToken(refreshToken);

    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (error) {

    res.status(401).json({
      error: "Invalid refresh token"
    });

  }

};

exports.logout = async (req, res) => {

  try {

    const { refreshToken } = req.body;

    await logoutUser(refreshToken);

    res.json({
      message: "Logged out successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: "Logout failed"
    });

  }

};