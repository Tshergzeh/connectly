const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');
const { createUser, findUserByEmail, findUserById } = require('../models/user.model');
const pool = require('../config/db');
const generateAccessToken = require('../utils/generate_access_token');
const generateRefreshToken = require('../utils/generate_refresh_token');

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class AuthService {
  static async signup({ name, email, password, isProvider, isCustomer }) {
    if (!name || !email || !password) {
      throw new AppError('Missing required fields', 400);
    }

    return await createUser({
      name,
      email,
      password,
      isProvider,
      isCustomer,
    });
  }

  static async login({ email, password }) {
    if (!email || !password) {
      throw new AppError('Missing email or password', 400);
    }

    const user = await findUserByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await bcrypt.compare(password, user.hashed_password);

    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
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
    if (!refreshToken) {
      throw new AppError('Missing refresh token', 400);
    }

    const tokenExistsQuery = await pool.query(`SELECT * FROM refresh_tokens WHERE token = $1`, [
      refreshToken,
    ]);

    if (tokenExistsQuery.rows.length === 0) {
      throw new AppError('Invalid refresh token', 401);
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await findUserById(payload.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken, user };
  }
}

module.exports = AuthService;
