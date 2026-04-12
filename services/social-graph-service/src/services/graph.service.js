// services/social-graph-service/src/services/graph.service.js
const db = require("../config/db");
const repo = require("../repositories/graph.repository");
const axios = require("axios");
const redis = require("../config/redis");

const USER_SERVICE = process.env.USER_SERVICE_URL || "http://localhost:4002";

const userExists = async (userId) => {
  const cacheKey = `user:exists:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return cached === "true";

  try {
    await axios.get(`${USER_SERVICE}/user/${userId}`);

    await redis.set(cacheKey, "true", "EX", 300);
    return true;
  } catch {
    await redis.set(cacheKey, "false", "EX", 60);
    return false;
  }
};

exports.followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const exists = await userExists(followingId);
  if (!exists) {
    throw new Error("User does not exist");
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const follow = await repo.createFollow(
      client,
      followerId,
      followingId
    );

    if (follow.rowCount === 0) {
      await client.query("ROLLBACK");
      return { message: "Already following" };
    }

    await repo.incrementStats(client, followerId, "following_count");
    await repo.incrementStats(client, followingId, "followers_count");

    await client.query("COMMIT");

    return { message: "Followed successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.unfollowUser = async (followerId, followingId) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await repo.deleteFollow(
      client,
      followerId,
      followingId
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return { message: "Not following" };
    }

    await repo.decrementStats(client, followerId, "following_count");
    await repo.decrementStats(client, followingId, "followers_count");

    await client.query("COMMIT");

    return { message: "Unfollowed successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.getFollowers = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const result = await repo.getFollowers(userId, limit, offset);

  const userIds = result.rows.map((row) => row.follower_id);

  const users = await getUserDetailsBulk(userIds);

  return {
    page,
    limit,
    data: users,
  };
};

exports.getFollowing = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const result = await repo.getFollowing(userId, limit, offset);

  const userIds = result.rows.map((row) => row.following_id);

  const users = await getUserDetailsBulk(userIds);

  return {
    page,
    limit,
    data: users,
  };
};

exports.getStats = async (userId) => {
  const result = await repo.getUserStats(userId);

  return result.rows[0] || {
    followers_count: 0,
    following_count: 0,
  };
};


const getUserDetailsBulk = async (userIds) => {
  if (!userIds.length) return [];

  const keys = userIds.map((id) => `user:${id}`);

  const cachedResults = await redis.mget(keys);

  const cachedUsers = [];
  const missingIds = [];

  cachedResults.forEach((data, index) => {
    if (data) {
      cachedUsers.push(JSON.parse(data));
    } else {
      missingIds.push(userIds[index]);
    }
  });

  let fetchedUsers = [];

  if (missingIds.length) {
    const response = await axios.post(
      `${USER_SERVICE}/user/bulk`,
      { userIds: missingIds }
    );

    fetchedUsers = response.data;

    const pipeline = redis.pipeline();

    fetchedUsers.forEach((user) => {
      pipeline.set(
        `user:${user.id}`,
        JSON.stringify(user),
        "EX",
        300
      );
    });

    await pipeline.exec();
  }

  const userMap = new Map();

  [...cachedUsers, ...fetchedUsers].forEach((user) => {
    userMap.set(user.id, user);
  });

  return userIds.map((id) => userMap.get(id)).filter(Boolean);
};

exports.getMutualFollowers = async (userId1, userId2, limit = 10) => {
  const result = await repo.getMutualFollowers(userId1, userId2, limit);

  const userIds = result.rows.map((row) => row.follower_id);

  const users = await getUserDetailsBulk(userIds);

  return users;
};

exports.getFollowSuggestions = async (userId, limit = 10) => {
  const result = await repo.getFollowSuggestions(userId, limit);

  const userIds = result.rows.map((row) => row.following_id);

  const users = await getUserDetailsBulk(userIds);

  return users;
};