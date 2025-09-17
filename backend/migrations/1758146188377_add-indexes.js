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
  pgm.createIndex('bookings', 'created_at');
  pgm.createIndex('bookings', 'customer_id');
  pgm.createIndex('bookings', 'service_id');
  pgm.createIndex('bookings', 'status');
  pgm.createIndex('refresh_tokens', 'user_id');
  pgm.createIndex('reviews', 'booking_id');
  pgm.createIndex('reviews', 'created_at');
  pgm.createIndex('services', 'created_at');
  pgm.createIndex('services', 'provider_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropIndex('bookings', 'created_at');
  pgm.dropIndex('bookings', 'customer_id');
  pgm.dropIndex('bookings', 'service_id');
  pgm.dropIndex('bookings', 'status');
  pgm.dropIndex('refresh_tokens', 'user_id');
  pgm.dropIndex('reviews', 'booking_id');
  pgm.dropIndex('reviews', 'created_at');
  pgm.dropIndex('services', 'created_at');
  pgm.dropIndex('services', 'provider_id');
};
