const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
