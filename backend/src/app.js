const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.post(
  '/api/payments/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req, res, next) => {
    req.body = JSON.parse(req.body.toString());
    next();
  }
);

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');
const reviewRoutes = require('./routes/review.routes');
const paymentRoutes = require('./routes/payment.routes');
const errorHandler = require('./middleware/error.middleware');

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', healthRoutes);

app.use(errorHandler);

module.exports = app;
