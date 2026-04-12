// services/social-graph-service/src/routes/graph.routes.js
const express = require("express");
const controller = require("../controllers/graph.controller");

const router = express.Router();

router.post("/follow/:userId", controller.followUser);
router.delete("/unfollow/:userId", controller.unfollowUser);
router.get("/followers/:userId", controller.getFollowers);
router.get("/following/:userId", controller.getFollowing);
router.get("/stats/:userId", controller.getStats);
router.get("/mutual/:userId1/:userId2", controller.getMutualFollowers);
router.get("/suggestions", controller.getSuggestions);

module.exports = router;