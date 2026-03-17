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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("password_reset_tokens");
};
