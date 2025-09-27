const ReviewService = require('../services/review.service');
const logger = require('../utils/logger');

exports.createReview = async (req, res, next) => {
  try {
    const review = await ReviewService.createReview({
      customerId: req.user.id,
      ...req.body,
    });
    logger.info('Review created successfully:', {
      reviewId: review.id,
      customerId: req.user.id,
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByService = async (req, res, next) => {
  try {
    const reviews = await ReviewService.getReviewsByService({
      serviceId: req.params.id,
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.getReviewByBookingId = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const review = await ReviewService.getReviewByBookingId(bookingId);
    res.json(review);
  } catch (error) {
    next(error);
  }
};
