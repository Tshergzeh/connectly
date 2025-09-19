const BookingService = require('../services/booking.service');

exports.createBooking = async (req, res) => {
  try {
    const booking = await BookingService.createBooking({
      customerId: req.user.id,
      serviceId: req.params.id,
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.log('Error creating booking:', error);
    res.status(400).json({ error: 'Error creating booking' });
  }
};

exports.getBookingsByCustomer = async (req, res) => {
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
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const bookingById = await BookingService.getBookingById({
      bookingId: req.params.id,
      customerId: req.user.id,
    });
    res.json(bookingById);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Error fetching booking' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await BookingService.updateBookingStatus({
      bookingId: req.params.id,
      status: req.body.status,
      customerId: req.user.id,
    });
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Error updating booking status' });
  }
};

exports.getBookingsByProvider = async (req, res) => {
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
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

exports.getBookingsByProviderAndStatus = async (req, res) => {
  try {
    const bookingsByProviderAndStatus = await BookingService.getBookingsByProviderAndStatus({
      providerId: req.user.id,
      status: req.params.id,
    });
    res.json(bookingsByProviderAndStatus);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};
