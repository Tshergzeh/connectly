const pool = require('../config/db');
const redisClient = require('../config/redis');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getHealthStatus = async () => {
  let dbConnected = false;
  try {
    await pool.query('SELECT 1');
    dbConnected = true;
  } catch (error) {
    dbConnected = false;
  }

  let paystackConnected = false;
  try {
    const response = await axios.get('https://api.paystack.co/balance', {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    paystackConnected = response.status === 200;
  } catch (_) {}

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
    status:
      dbConnected && paystackConnected && redisConnected && emailConnected ? 'ok' : 'degraded',
    dbConnected,
    paystackConnected,
    redisConnected,
    emailConnected,
    timestamp: new Date().toISOString(),
  };
};
