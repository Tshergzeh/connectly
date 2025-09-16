const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/', authenticate, reviewController.createReview);
router.get('/service/:id', authenticate, reviewController.getReviewsByService);

module.exports = router;
