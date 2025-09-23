const pool = require('../config/db');
const redisClient = require('../config/redis');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

  let emailConnected = false;
  try {
    const [response, body] = await sgMail.client.request({
      method: 'GET',
      url: '/v3/user/account',
    });
    emailConnected = response.statusCode === 200;
  } catch (_) {}

  return {
    status: dbConnected && redisConnected && emailConnected ? 'ok' : 'degraded',
    dbConnected,
    redisConnected,
    emailConnected,
    timestamp: new Date().toISOString(),
  };
};
