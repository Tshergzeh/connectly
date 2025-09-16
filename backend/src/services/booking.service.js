const { v4: uuidv4 } = require('uuid');
const BookingModel = require('../models/booking.model');
const ServiceModel = require('../models/service.model');

class BookingService {
  static async createBooking({ serviceId, customerId }) {
    if (!serviceId || !customerId) {
      throw new Error('Missing required fields');
    }

    const service = await ServiceModel.getServiceById(serviceId);

    if (service.is_active) {
      throw new Error('Cannot book inactive service');
    }

    const id = uuidv4();
    const status = 'Pending';

    return await BookingModel.createBooking({
      id,
      customerId,
      serviceId,
      status,
    });
  }

  static async getBookingsByCustomer(customerId) {
    return await BookingModel.getBookingsByCustomer(customerId);
  }

  static async getBookingById({ bookingId, customerId }) {
    if (!bookingId) {
      throw new Error('Missing booking ID');
    }

    const booking = await BookingModel.getBookingById(bookingId);

    if (booking.customer_id !== customerId) {
      throw new Error('Not authorized to view this booking');
    }

    return booking;
  }

  static async updateBookingStatus({ bookingId, status, customerId }) {
    if (!bookingId || !status) {
      throw new Error('Missing required fields');
    }

    const existingBooking = await BookingModel.getBookingById(bookingId);

    if (existingBooking.customer_id !== customerId) {
      throw new Error('Not authorized to update this booking');
    }

    if (status !== 'Paid' && status !== 'Completed' && status !== 'Cancelled') {
      throw new Error('Invalid status');
    }

    return await BookingModel.updateBookingStatus({ bookingId, status });
  }

  static async getBookingsByProvider(providerId) {
    return await BookingModel.getBookingsByProvider(providerId);
  }

  static async getBookingsByProviderAndStatus({ providerId, status }) {
    if (
      status !== 'Pending' &&
      status !== 'Paid' &&
      status !== 'Completed' &&
      status !== 'Cancelled'
    ) {
      throw new Error('Invalid status');
    }
    return await BookingModel.getBookingsByProviderAndStatus({
      providerId,
      status,
    });
  }
}

module.exports = BookingService;
