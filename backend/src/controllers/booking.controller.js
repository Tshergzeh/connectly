const BookingService = require('../services/booking.service');
const logger = require('../utils/logger');

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await BookingService.createBooking({
      customerId: req.user.id,
      serviceId: req.params.id,
    });

    logger.info('Booking created successfully:', {
      bookingId: booking.id,
      customerId: req.user.id,
    });
    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingsByCustomer = async (req, res, next) => {
  try {
    const { limit = 10, cursor } = req.query;

    const bookings = await BookingService.getBookingsByCustomer({
      customerId: req.user.id,
      limit: parseInt(limit, 10),
      cursor: cursor || null,
    });
    res.json({
      data: bookings,
      nextCursor: bookings.length > 0 ? bookings[bookings.length - 1].created_at : null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const bookingById = await BookingService.getBookingById({
      bookingId: req.params.id,
      customerId: req.user.id,
    });
    res.json(bookingById);
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await BookingService.updateBookingStatus({
      bookingId: req.params.id,
      status: req.body.status,
      user: req.user,
    });
    logger.info('Booking status updated successfully:', {
      bookingId: booking.id,
      newStatus: booking.status,
    });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getBookingsByProvider = async (req, res, next) => {
  try {
    const { limit = 10, cursor } = req.query;

    const bookings = await BookingService.getBookingsByProvider({
      providerId: req.user.id,
      limit: parseInt(limit, 10),
      cursor: cursor || null,
    });
    res.json({
      data: bookings,
      nextCursor: bookings.length > 0 ? bookings[bookings.length - 1].created_at : null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingsByProviderAndStatus = async (req, res, next) => {
  try {
    const { limit = 10, cursor } = req.query;

    const bookings = await BookingService.getBookingsByProviderAndStatus({
      providerId: req.user.id,
      status: req.params.id,
      limit: parseInt(limit, 10),
      cursor: cursor || null,
    });
    res.json({
      data: bookings,
      nextCursor: bookings.length > 0 ? bookings[bookings.length - 1].created_at : null,
    });
  } catch (error) {
    next(error);
  }
};
