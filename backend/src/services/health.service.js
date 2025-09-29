const pool = require('../config/db');
const redisClient = require('../config/redis');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getHealthStatus = async () => {
  let dbConnected = false;
  try {
    await pool.query('SELECT 1');
    dbConnected = true;
  } catch (_) {}

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
  } catch (_) {}

  let emailConnected = false;
  try {
    const [response, body] = await sgMail.client.request({
      method: 'GET',
      url: '/v3/user/account',
    });
    emailConnected = response.statusCode === 200;
  } catch (_) {}

  let cloudinaryConnected = false;
  try {
    const result = await cloudinary.api.ping();
    cloudinaryConnected = result.status === 'ok';
  } catch (_) {}

  return {
    status:
      dbConnected && paystackConnected && redisConnected && emailConnected && cloudinaryConnected
        ? 'ok'
        : 'degraded',
    dbConnected,
    paystackConnected,
    redisConnected,
    emailConnected,
    cloudinaryConnected,
    timestamp: new Date().toISOString(),
  };
};
