require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      is_provider: user.is_provider,
      is_customer: user.is_customer,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

module.exports = generateAccessToken;
