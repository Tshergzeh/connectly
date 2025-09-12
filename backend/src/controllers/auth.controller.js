require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUser } = require('../models/user.model');
const generateAccessToken = require('../utils/generate_access_token');
const generateRefreshToken = require('../utils/generate_refresh_token');

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

async function signup(req, res) {
  try {
    const { name, email, password, is_provider, is_customer } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required',
      });
    }

    const user = await createUser({
      name,
      email,
      password,
      isProvider: is_provider,
      isCustomer: is_customer,
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    const loginQuery = 'SELECT * FROM users WHERE email = $1';
    const loginQueryResult = await pool.query(loginQuery, [email]);

    if (loginQueryResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = loginQueryResult.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query(
      `
      INSERT INTO refresh_tokens (token, user_id, expires_at) 
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
    `,
      [refreshToken, user.id]
    );

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_provider: user.is_provider,
        is_customer: user.is_customer,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokenQueryResult = await pool.query(`SELECT * FROM refresh_tokens WHERE token = $1`, [
      refreshToken,
    ]);

    if (tokenQueryResult.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const userQueryResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [payload.id]);

    if (userQueryResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userQueryResult.rows[0];
    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
}

module.exports = { signup, login, refreshToken };
