const healthService = require('../services/health.service');

exports.getHealth = async (req, res) => {
  const healthStatus = await healthService.getHealthStatus();
  res.json(healthStatus);
};
