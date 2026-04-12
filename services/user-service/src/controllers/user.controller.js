// services/user-service/src/controllers/user.controller.js
const { getUserProfile } = require("../services/user.service");
const { createUserProfile } = require("../services/user.service");
const { getUsersByIds } = require("../services/user.service");

exports.getMe = async (req, res) => {
  try {
    console.log("HEADERS:", req.headers);

    const userId = parseInt(req.headers["x-user-id"]);
    // const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Invalid user context",
      });
    }

    const user = await getUserProfile(userId);

    res.json({
      user,
    });

  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    console.log("CREATE USER BODY:", req.body);

    const { id, email } = req.body;

    const user = await createUserProfile(id, email);

    res.status(201).json({ user });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsersBulk = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
      return res.status(400).json({ error: "userIds must be an array" });
    }

    const users = await getUsersByIds(userIds);

    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};