const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/initialise', authenticate, paymentController.initialisePayment);

module.exports = router;
