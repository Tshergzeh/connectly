const { createUser } = require('../models/user.model');

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

module.exports = { signup };
