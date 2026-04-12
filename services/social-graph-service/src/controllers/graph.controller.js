// services/social-graph-service/src/controllers/graph.controller.js
const service = require("../services/graph.service");

exports.followUser = async (req, res) => {
  try {
    const followerId = req.headers["x-user-id"];
    const followingId = parseInt(req.params.userId);

    const result = await service.followUser(followerId, followingId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.headers["x-user-id"];
    const followingId = parseInt(req.params.userId);

    const result = await service.unfollowUser(followerId, followingId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await service.getFollowers(userId, page, limit);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await service.getFollowing(userId, page, limit);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await service.getStats(userId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMutualFollowers = async (req, res) => {
  try {
    const userId1 = parseInt(req.params.userId1);
    const userId2 = parseInt(req.params.userId2);

    const result = await service.getMutualFollowers(userId1, userId2);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const userId = parseInt(req.headers["x-user-id"]);
    const limit = parseInt(req.query.limit) || 10;

    const result = await service.getFollowSuggestions(userId, limit);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};