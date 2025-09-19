const { v4: uuidv4 } = require('uuid');
const BookingModel = require('../models/booking.model');
const ServiceModel = require('../models/service.model');
const UserModel = require('../models/user.model');

class BookingService {
  static async createBooking({ serviceId, customerId }) {
    if (!serviceId || !customerId) {
      throw new Error('Missing required fields');
    }

    const service = await ServiceModel.getServiceById(serviceId);

    if (!service.is_active) {
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

  static async getBookingsByCustomer({ customerId, limit, cursor }) {
    const bookings = await BookingModel.getBookingsByCustomer({
      customerId,
      limit,
      cursor,
    });
    return bookings.map((booking) => ({
      id: booking.booking_id,
      status: booking.status,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      service: {
        id: booking.service_id,
        title: booking.title,
        description: booking.description,
        price: booking.price,
        image: booking.image,
      },
      review: booking.review_id
        ? {
            id: booking.review_id,
            rating: booking.rating,
            comment: booking.comment,
            created_at: booking.review_created_at,
          }
        : null,
    }));
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

  static async updateBookingStatusByReference({ reference, status }) {
    if (!reference || !status) {
      throw new Error('Missing required fields');
    }

    const existingBooking = await BookingModel.getBookingByReference(reference);
    const bookingId = existingBooking.id;

    if (status !== 'Paid' && status !== 'Completed' && status !== 'Cancelled') {
      throw new Error('Invalid status');
    }

    return await BookingModel.updateBookingStatus({ bookingId, status });
  }

  static async getBookingsByProvider({ providerId, limit, cursor }) {
    const user = await UserModel.findUserById(providerId);
    if (!user.is_provider) {
      throw new Error('Not authorized as provider');
    }

    const bookings = await BookingModel.getBookingsByProvider({
      providerId,
      limit,
      cursor,
    });
    return bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      payment_id: booking.payment_id,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      service: {
        id: booking.service_id,
        provider_id: booking.provider_id,
        title: booking.title,
        price: booking.price,
      },
      customer: {
        id: booking.customer_id,
        name: booking.name,
        email: booking.email,
      },
    }));
  }

  static async getBookingsByProviderAndStatus({ providerId, status }) {
    const user = await UserModel.findUserById(providerId);
    if (!user.is_provider) {
      throw new Error('Not authorized as provider');
    }

    if (
      status !== 'Pending' &&
      status !== 'Paid' &&
      status !== 'Completed' &&
      status !== 'Cancelled'
    ) {
      throw new Error('Invalid status');
    }

    const bookings = await BookingModel.getBookingsByProviderAndStatus({
      providerId,
      status,
    });

    return bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      payment_id: booking.payment_id,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      service: {
        id: booking.service_id,
        provider_id: booking.provider_id,
        title: booking.title,
        price: booking.price,
      },
      customer: {
        id: booking.customer_id,
        name: booking.name,
        email: booking.email,
      },
    }));
  }
}

module.exports = BookingService;
