/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('payments', {
    id: { type: 'uuid', notNull: true, primaryKey: true },
    booking_id: {
      type: 'uuid',
      notNull: true,
      references: 'bookings',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    amount: { type: 'integer', notNull: true },
    status: { type: 'boolean', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('payments');
};
