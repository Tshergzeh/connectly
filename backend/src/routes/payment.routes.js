const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/initialise', authenticate, paymentController.initialisePayment);
router.post('/webhook', paymentController.handleWebhook);
router.post('/verify', authenticate, paymentController.verifyPayment);

module.exports = router;
