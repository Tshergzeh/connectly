const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUser, findUserByEmail, findUserById } = require('../models/user.model');
const pool = require('../config/db');
const generateAccessToken = require('../utils/generate_access_token');
const generateRefreshToken = require('../utils/generate_refresh_token');

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class AuthService {
  static async signup({ name, email, password, isProvider, isCustomer }) {
    return await createUser({
      name,
      email,
      password,
      isProvider,
      isCustomer,
    });
  }

  static async login({ email, password }) {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.hashed_password);

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [user.id]);
    await pool.query(
      `INSERT INTO refresh_tokens (token, user_id, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [refreshToken, user.id]
    );

    return { user, accessToken, refreshToken };
  }

  static async refreshToken(refreshToken) {
    const tokenExistsQuery = await pool.query(`SELECT * FROM refresh_tokens WHERE token = $1`, [
      refreshToken,
    ]);

    if (tokenExistsQuery.rows.length === 0) {
      throw new Error('Invalid refresh token');
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await findUserById(payload.id);

    if (!user) {
      throw new Error('User not found');
    }

    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken, user };
  }
}

module.exports = AuthService;
