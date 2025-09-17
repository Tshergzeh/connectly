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
  pgm.createTable('services', {
    id: { type: 'uuid', notNull: true, primaryKey: true },
    provider_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    title: { type: 'text', notNull: true },
    description: { type: 'text', notNull: true },
    price: { type: 'NUMERIC(10,2)', notNull: true },
    category: { type: 'character varying(50)', notNull: true },
    image: { type: 'text', notNull: true },
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createTable('bookings', {
    id: { type: 'uuid', primaryKey: true, notNull: true },
    service_id: {
      type: 'uuid',
      notNull: true,
      references: 'services',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    customer_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    status: { type: 'text', notNull: true },
    payment_id: { type: 'text' },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createTable('reviews', {
    id: { type: 'uuid', notNull: true, primaryKey: true },
    booking_id: {
      type: 'uuid',
      notNull: true,
      references: 'bookings',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    rating: { type: 'integer', notNull: true },
    comment: { type: 'text' },
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
  pgm.dropTable('reviews');
  pgm.dropTable('bookings');
};
