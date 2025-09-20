require('dotenv').config();
const AuthService = require('../services/auth.service');

async function signup(req, res) {
  try {
    const { name, email, password, is_provider, is_customer } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required',
      });
    }

    const user = await AuthService.signup({
      name,
      email,
      password,
      isProvider: is_provider,
      isCustomer: is_customer,
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: error.message });
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

    const { user, accessToken, refreshToken } = await AuthService.login({ email, password });
    const { hashed_password, ...userWithoutPassword } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login successful',
      accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json({ error: error.message });
  }
}

async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ error: 'Refresh token is required' });
    }

    const { accessToken } = await AuthService.refreshToken(refreshToken);
    res.json({ accessToken });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
}

module.exports = { signup, login, refreshToken };
