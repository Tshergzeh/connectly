const { v4: uuidv4 } = require('uuid');
const ReviewModel = require('../models/review.model');
const BookingModel = require('../models/booking.model');

class ReviewService {
  static async createReview({ customerId, bookingId, rating, comment }) {
    if (!customerId || !bookingId || !rating) {
      throw new Error('Missing required fields');
    }

    const booking = await BookingModel.getBookingById(bookingId);

    if (booking.customer_id !== customerId) {
      throw new Error('Not authorized to review this booking');
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
}

module.exports = ReviewService;
