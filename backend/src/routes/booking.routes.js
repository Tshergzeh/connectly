const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking.controller');
const authenticate = require('../middleware/auth.middleware');

router.get('/provider/:id', authenticate, bookingController.getBookingsByProviderAndStatus);
router.get('/provider', authenticate, bookingController.getBookingsByProvider);
router.post('/:id', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getBookingsByCustomer);
router.get('/:id', authenticate, bookingController.getBookingById);
router.patch('/:id', authenticate, bookingController.updateBookingStatus);

module.exports = router;
