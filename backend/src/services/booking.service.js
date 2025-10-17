const { v4: uuidv4 } = require('uuid');

const AppError = require('../utils/AppError');
const BookingModel = require('../models/booking.model');
const ServiceModel = require('../models/service.model');
const UserModel = require('../models/user.model');

class BookingService {
  static async createBooking({ serviceId, customerId }) {
    if (!serviceId || !customerId) {
      throw new AppError('Missing required fields', 400);
    }

    const service = await ServiceModel.getServiceById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (!service.is_active) {
      throw new AppError('Cannot book inactive service', 400);
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
    if (!customerId) {
      throw new AppError('Missing customer ID', 400);
    }

    const rows = await BookingModel.getBookingsByCustomer({
      customerId,
      limit,
      cursor,
    });

    if (!rows || rows.length === 0) return { bookings: [], nextCursor: null };

    const hasNext = rows.length > limit;
    const bookings = rows.slice(0, limit).map((booking) => ({
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

    const nextCursor = hasNext ? bookings[bookings.length - 1].created_at : null;

    const result = { bookings, nextCursor };
    return result;
  }

  static async getBookingById({ bookingId, customerId }) {
    if (!bookingId) {
      throw new Error('Missing booking ID');
    }

    const booking = await BookingModel.getBookingById(bookingId);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.customer_id !== customerId) {
      throw new AppError('Not authorized to view this booking', 403);
    }

    return booking;
  }

  static async updateBookingStatus({ bookingId, status, user }) {
    if (!bookingId || !status) {
      throw new AppError('Missing required fields', 400);
    }

    const existingBooking = await BookingModel.getBookingById(bookingId);

    if (!existingBooking) {
      throw new AppError('Booking not found', 404);
    }

    if (user.is_customer) {
      if (existingBooking.customer_id !== user.id) {
        throw new AppError('Not authorized to update this booking', 403);
      }

      if (status !== 'Cancelled' && status !== 'Paid') {
        throw new AppError('Customers can only cancel or mark bookings as paid', 403);
      }
    }

    if (user.is_provider) {
      const service = await ServiceModel.getServiceById(existingBooking.service_id);

      if (!service) {
        throw new AppError('Service not found', 404);
      }

      if (service.provider_id !== user.id) {
        throw new AppError('Not authorized to update this booking', 403);
      }

      if (status !== 'Completed' && status !== 'Cancelled') {
        throw new AppError('Providers can only mark bookings as completed or cancelled', 403);
      }

      if (existingBooking.status !== 'Paid' && status === 'Completed') {
        throw new AppError("Booking must be marked as 'Paid' before it can be completed", 400);
      }
    }

    if (status !== 'Paid' && status !== 'Completed' && status !== 'Cancelled') {
      throw new AppError('Invalid status', 400);
    }

    return await BookingModel.updateBookingStatus({ bookingId, status });
  }

  static async updateBookingStatusByReference({ reference, status }) {
    if (!reference || !status) {
      throw new AppError('Missing required fields', 400);
    }

    const existingBooking = await BookingModel.getBookingByReference(reference);

    if (!existingBooking) {
      throw new AppError('Booking not found', 404);
    }

    const bookingId = existingBooking.id;

    if (status !== 'Paid' && status !== 'Completed' && status !== 'Cancelled') {
      throw new AppError('Invalid status', 400);
    }

    return await BookingModel.updateBookingStatus({ bookingId, status });
  }

  static async getBookingsByProvider({ providerId, limit, cursor }) {
    if (!providerId) {
      throw new AppError('Missing provider ID', 400);
    }

    const user = await UserModel.findUserById(providerId);
    if (!user.is_provider) {
      throw new AppError('Not authorized as provider', 403);
    }

    const bookings = await BookingModel.getBookingsByProvider({
      providerId,
      limit,
      cursor,
    });

    if (bookings.length === 0) {
      throw new AppError('No bookings found', 404);
    }

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

  static async getBookingsByProviderAndStatus({ providerId, status, limit, cursor }) {
    if (!providerId || !status) {
      throw new AppError('Missing required fields', 400);
    }

    const user = await UserModel.findUserById(providerId);
    if (!user.is_provider) {
      throw new AppError('Not authorized as provider', 403);
    }

    if (
      status !== 'Pending' &&
      status !== 'Paid' &&
      status !== 'Completed' &&
      status !== 'Cancelled'
    ) {
      throw new AppError('Invalid status', 400);
    }

    const bookings = await BookingModel.getBookingsByProviderAndStatus({
      providerId,
      status,
      limit,
      cursor,
    });

    if (bookings.length === 0) {
      throw new AppError('No bookings found', 404);
    }

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

  static async deletePendingBookingById({ bookingId, user }) {
    if (!bookingId) {
      throw new AppError('Missing booking ID', 400);
    }

    const existingBooking = await BookingModel.getBookingById(bookingId);

    if (!existingBooking) {
      throw new AppError('Booking not found', 404);
    }

    if (existingBooking.customer_id !== user.id) {
      throw new AppError('Not authorized to update this booking', 403);
    }

    if (existingBooking.status !== 'Pending') {
      throw new AppError('Only pending bookings can be deleted', 400);
    }

    return await BookingModel.deletePendingBookingById(bookingId);
  }
}

module.exports = BookingService;
