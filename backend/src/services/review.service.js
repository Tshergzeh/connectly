const { v4: uuidv4 } = require('uuid');

const AppError = require('../utils/AppError');
const ReviewModel = require('../models/review.model');
const BookingModel = require('../models/booking.model');
const ServiceModel = require('../models/service.model');

class ReviewService {
  static async createReview({ customerId, bookingId, rating, comment }) {
    if (!customerId || !bookingId || !rating) {
      throw new AppError('Missing required fields', 400);
    }

    const booking = await BookingModel.getBookingById(bookingId);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    const service = await ServiceModel.getServiceById(booking.service_id);
    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (service.provider_id === customerId) {
      throw new AppError('Cannot review your own service', 403);
    }

    if (booking.customer_id !== customerId) {
      throw new AppError('Not authorized to review this booking', 403);
    }

    if (booking.status !== 'Completed') {
      throw new AppError('Cannot review uncompleted booking', 400);
    }

    const id = uuidv4();
    return await ReviewModel.createReview({
      id,
      bookingId,
      rating,
      comment,
    });
  }

  static async getReviewsByService({ serviceId }) {
    if (!serviceId) {
      throw new AppError('Missing service ID', 400);
    }

    return await ReviewModel.getReviewsByService({ serviceId });
  }

  static async getReviewByBookingId(bookingId) {
    if (!bookingId) {
      throw new AppError('Missing booking ID', 400);
    }

    const review = await ReviewModel.getReviewByBookingId(bookingId);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    return review;
  }
}

module.exports = ReviewService;
