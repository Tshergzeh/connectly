require('dotenv').config();

const logger = require('../utils/logger');
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

    logger.info('User signed up successfully:', {
      userId: user.id,
      email: user.email,
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    logger.error('Error during signup:', error);
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.login({ email, password });
    const { hashed_password, ...userWithoutPassword } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info('User logged in successfully:', { userId: user.id, email: user.email });
    res.json({
      message: 'Login successful',
      accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await AuthService.refreshToken(refreshToken);
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login, refreshToken };
