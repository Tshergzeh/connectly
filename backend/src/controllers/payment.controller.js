const PaymentService = require('../services/payment.service');

exports.initialisePayment = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const response = await PaymentService.initialisePayment({ email, amount });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error initialising payment:', error);
    res.status(500).json({ error: 'Error initialising payment' });
  }
};
