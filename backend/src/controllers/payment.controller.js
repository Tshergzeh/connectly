const crypto = require('crypto');

const PaymentService = require('../services/payment.service');
const BookingService = require('../services/booking.service');

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

exports.handleWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    // if (hash !== req.headers['x-paystack-signature']) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const event = req.body;

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const amount = event.data.amount / 100;
      const email = event.data.customer.email;

      const updatedBooking = await BookingService.updateBookingStatusByReference({
        reference,
        status: 'Paid',
      });

      await PaymentService.storePayment({
        bookingId: updatedBooking.id,
        amount,
        status: true,
      });

      console.log(`Payment successful: ${reference} - ${email} - ₦${amount}`);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling Paystack webhook:', error);
    res.sendStatus(500);
  }
};
