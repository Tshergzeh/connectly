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

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', healthRoutes);

module.exports = app;
