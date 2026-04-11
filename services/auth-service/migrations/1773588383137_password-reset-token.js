/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("password_reset_tokens", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade"
    },
    token_hash: {
      type: "text",
      notNull: true
    },
    expires_at: {
      type: "timestamp",
      notNull: true
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp")
    }
  });

  // ✅ ADD YOUR INDEX HERE
  pgm.sql(`
    CREATE INDEX idx_token_hash 
    ON password_reset_tokens(token_hash);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS idx_token_hash`);
  pgm.dropTable("password_reset_tokens");
};
