/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    email: { type: "varchar(255)", notNull: true },
    username: { type: "varchar(50)", notNull: true, unique: true },
    display_name: { type: "varchar(100)" },
    bio: { type: "text" },
    profile_picture: { type: "text" },
    is_creator: { type: "boolean", default: false },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.sql(`
    CREATE UNIQUE INDEX users_email_unique_idx
    ON users (LOWER(email));
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS users_email_unique_idx`);
  pgm.dropTable("users");
};
