require('dotenv').config();
const { Pool } = require('pg');

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  connectionString: isTest ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

module.exports = pool;
