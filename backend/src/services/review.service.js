const { v4: uuidv4 } = require('uuid');
const ReviewModel = require('../models/review.model');
const BookingModel = require('../models/booking.model');
const ServiceModel = require('../models/service.model');

class ReviewService {
  static async createReview({ customerId, bookingId, rating, comment }) {
    if (!customerId || !bookingId || !rating) {
      throw new Error('Missing required fields');
    }

    const booking = await BookingModel.getBookingById(bookingId);
    const service = await ServiceModel.getServiceById(booking.service_id);

    if (service.provider_id === customerId) {
      throw new Error('Cannot review your own service');
    }

    if (booking.customer_id !== customerId) {
      throw new Error('Not authorized to review this booking');
    }

    if (booking.status !== 'Completed') {
      throw new Error('Cannot review uncompleted booking');
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
      throw new Error('Missing service ID');
    }

    return await ReviewModel.getReviewsByService({ serviceId });
  }

  static async getReviewByBookingId(bookingId) {
    if (!bookingId) {
      throw new Error('Missing booking ID');
    }

    const review = await ReviewModel.getReviewByBookingId(bookingId);

    if (!review) {
      return null;
    }

    return review;
  }
}

module.exports = ReviewService;
