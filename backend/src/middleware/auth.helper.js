const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function decodeUser(req) {
  const authHeader = req.headers['Authorization'];

  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = decodeUser;
