const pool = require('../config/db');
const redisClient = require('../config/redis');

exports.getHealthStatus = async () => {
  let dbConnected = false;
  try {
    await pool.query('SELECT 1');
    dbConnected = true;
  } catch (error) {
    dbConnected = false;
  }

  let redisConnected = false;
  try {
    const pong = await redisClient.ping();
    redisConnected = pong === 'PONG';
  } catch (error) {
    redisConnected = false;
  }

  return {
    status: dbConnected && redisConnected ? 'ok' : 'error',
    dbConnected,
    redisConnected,
    timestamp: new Date().toISOString(),
  };
};
