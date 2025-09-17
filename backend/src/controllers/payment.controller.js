const PaymentService = require('../services/payment.service');

exports.initialisePayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const customerEmail = req.user.email;
    const customerId = req.user.id;
    const response = await PaymentService.initialisePayment({
      bookingId,
      customerEmail,
      customerId,
      amount,
    });
    res.json(response);
  } catch (error) {
    console.error('Error initialising payment:', error);
    res.status(500).json({ error: 'Error initialising payment' });
  }
};
