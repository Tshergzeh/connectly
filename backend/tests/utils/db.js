const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const pool = require('../../src/config/db');

async function resetDb() {
  await pool.query('TRUNCATE bookings, reviews, services, users RESTART IDENTITY CASCADE');
}

async function seedData() {
  const customerId = uuidv4();
  const providerId = uuidv4();
  const hashedPassword = await bcrypt.hash('password123', 10);

  await pool.query(
    `INSERT INTO users (id, email, hashed_password, name, is_customer, is_provider)
        VALUES ($1, $2, $3, $4, $5)`,
    [customerId, 'customer@test.com', hashedPassword, 'Test Customer', true, false]
  );

  await pool.query(
    `INSERT INTO users (id, email, hashed_password, name, is_provider, is_customer)
        VALUES ($1, $2, $3, $4, $5)`,
    [providerId, 'provider@test.com', hashedPassword, 'Test Provider', true, false]
  );

  const serviceId = uuidv4();
  await pool.query(
    `INSERT INTO services (id, provider_id, title, description, price, category, image)
        VALUES ($1, $2, 'Test Service', 'Service description', 100, 'Test Category', 'test.jpg')`,
    [serviceId, providerId]
  );

  const bookingId = uuidv4();
  await pool.query(
    `INSERT INTO bookings (id, service_id, customer_id, status)
        VALUES ($1, $2, $3, 'Pending')`,
    [bookingId, serviceId, customerId]
  );

  return { customerId, providerId, serviceId, bookingId };
}

module.exports = { resetDb, seedData };
