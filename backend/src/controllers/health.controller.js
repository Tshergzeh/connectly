const healthService = require('../services/health.service');
const logger = require('../utils/logger');

exports.getHealth = async (req, res) => {
  try {
    const healthStatus = await healthService.getHealthStatus();
    res.json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error.message);
    res.status(500).json({
      status: 'error',
      dbConnected: false,
      redisConnected: false,
      error: error.message,
    });
  }
};
