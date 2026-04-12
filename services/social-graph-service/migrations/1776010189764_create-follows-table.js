/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable("follows", {
    id: "id",

    follower_id: {
      type: "integer",
      notNull: true,
    },

    following_id: {
      type: "integer",
      notNull: true,
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  // ❗ Prevent duplicate follows
  pgm.addConstraint("follows", "unique_follow_relationship", {
    unique: ["follower_id", "following_id"],
  });

  // 🚀 Performance indexes (VERY IMPORTANT)
  pgm.createIndex("follows", ["follower_id"]);
  pgm.createIndex("follows", ["following_id"]);

  // ❗ Prevent self-follow at DB level
  pgm.addConstraint("follows", "no_self_follow", {
    check: "follower_id <> following_id",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("follows");
};
