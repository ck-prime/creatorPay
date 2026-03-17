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
    pgm.createTable("users", {
    id: "id",

    email: {
        type: "varchar(255)",
        notNull: true
    },

    password_hash: {
        type: "text",
        notNull: true
    },

    created_at: {
        type: "timestamp",
        default: pgm.func("current_timestamp")
    }
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
export const down = (pgm) => {
    pgm.sql(`DROP INDEX IF EXISTS users_email_unique_idx`);
    pgm.dropTable("users");
};
