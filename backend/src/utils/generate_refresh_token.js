require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = generateRefreshToken;
