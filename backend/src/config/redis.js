const { createClient } = require('redis');

const logger = require('../utils/logger');

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => logger.error('Redis Client Error', err));

client
  .connect()
  .then(() => logger.info('Redis connected'))
  .catch((err) => logger.error('Redis connection error:', err));

module.exports = client;
