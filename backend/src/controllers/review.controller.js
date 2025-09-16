const ReviewService = require('../services/review.service');

exports.createReview = async (req, res) => {
  try {
    const review = await ReviewService.createReview({
      customerId: req.user.id,
      ...req.body,
    });
    res.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Error creating review' });
  }
};

exports.getReviewsByService = async (req, res) => {
  try {
    const reviews = await ReviewService.getReviewsByService({
      serviceId: req.params.id,
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ error: 'Error getting reviews' });
  }
};
