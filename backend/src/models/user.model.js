const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function createUser({ name, email, password, isProvider, isCustomer }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const createUserQuery = `
        INSERT INTO users (name, email, hashed_password, is_provider, is_customer)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, is_provider, is_customer, created_at, updated_at;
    `;

  const userValues = [name, email, hashedPassword, isProvider, isCustomer];
  const createUserQueryResult = await pool.query(createUserQuery, userValues);

  return createUserQueryResult.rows[0];
}

module.exports = { createUser };
