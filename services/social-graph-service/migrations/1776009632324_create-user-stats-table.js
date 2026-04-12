/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable("user_stats", {
    user_id: {
      type: "integer",
      primaryKey: true,
    },

    followers_count: {
      type: "integer",
      default: 0,
      notNull: true,
    },

    following_count: {
      type: "integer",
      default: 0,
      notNull: true,
    },

    updated_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  // Optional index (useful later)
  pgm.createIndex("user_stats", ["followers_count"]);
};

exports.down = (pgm) => {
  pgm.dropTable("user_stats");
};