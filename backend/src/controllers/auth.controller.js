require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUser } = require('../models/user.model');

// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.JWT_SECRET;

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

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        is_provider: user.is_provider,
        is_customer: user.is_customer,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
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

module.exports = { signup, login };
