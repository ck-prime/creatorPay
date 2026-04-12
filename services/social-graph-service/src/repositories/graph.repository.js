// services/social-graph-service/src/repositories/graph.repository.js
const db = require("../config/db");

exports.createFollow = async (client, followerId, followingId) => {
  return client.query(
    `
    INSERT INTO follows (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
    `,
    [followerId, followingId]
  );
};

exports.deleteFollow = async (client, followerId, followingId) => {
  return client.query(
    `
    DELETE FROM follows
    WHERE follower_id = $1 AND following_id = $2
    RETURNING *;
    `,
    [followerId, followingId]
  );
};

exports.incrementStats = async (client, userId, field) => {
  return client.query(
    `
    INSERT INTO user_stats (user_id, ${field})
    VALUES ($1, 1)
    ON CONFLICT (user_id)
    DO UPDATE SET ${field} = user_stats.${field} + 1;
    `,
    [userId]
  );
};

exports.decrementStats = async (client, userId, field) => {
  return client.query(
    `
    UPDATE user_stats
    SET ${field} = ${field} - 1
    WHERE user_id = $1;
    `,
    [userId]
  );
};

exports.getFollowers = async (userId, limit, offset) => {
  return db.query(
    `
    SELECT follower_id, created_at
    FROM follows
    WHERE following_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
    `,
    [userId, limit, offset]
  );
};

exports.getFollowing = async (userId, limit, offset) => {
  return db.query(
    `
    SELECT following_id, created_at
    FROM follows
    WHERE follower_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
    `,
    [userId, limit, offset]
  );
};

exports.getUserStats = async (userId) => {
  return db.query(
    `
    SELECT followers_count, following_count
    FROM user_stats
    WHERE user_id = $1;
    `,
    [userId]
  );
};

exports.getMutualFollowers = async (userId1, userId2, limit = 10) => {
  return db.query(
    `
    SELECT f1.follower_id
    FROM follows f1
    INNER JOIN follows f2
      ON f1.follower_id = f2.follower_id
    WHERE f1.following_id = $1
      AND f2.following_id = $2
    LIMIT $3;
    `,
    [userId1, userId2, limit]
  );
};

exports.getFollowSuggestions = async (userId, limit = 10) => {
  return db.query(
    `
    SELECT f2.following_id, COUNT(*) as score
    FROM follows f1
    JOIN follows f2
      ON f1.following_id = f2.follower_id
    WHERE f1.follower_id = $1
      AND f2.following_id != $1
      AND f2.following_id NOT IN (
        SELECT following_id FROM follows WHERE follower_id = $1
      )
    GROUP BY f2.following_id
    ORDER BY score DESC
    LIMIT $2;
    `,
    [userId, limit]
  );
};