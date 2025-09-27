require('dotenv').config();
const { Pool } = require('pg');

const logger = require('../utils/logger');

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  connectionString: isTest ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
});

(async () => {
  try {
    await pool.query('SELECT 1');
    logger.info('Database connection successful');
  } catch (error) {
    logger.error('Database connection error:', error);
  }
})();

pool.on('error', (error) => {
  logger.error('Unexpected error on idle client:', error);
});

module.exports = pool;
