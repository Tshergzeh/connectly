require('dotenv').config();
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'user'
            )
        `);

    res.json({
      status: 'ok',
      dbConnected: true,
      userTableExists: result.rows[0].exists,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(500).json({
      status: 'error',
      dbConnected: false,
      error: error.message,
    });
  }
});

module.exports = router;
