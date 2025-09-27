const PaymentService = require('../services/payment.service');
const BookingService = require('../services/booking.service');

exports.initialisePayment = async (req, res, next) => {
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
    next(error);
  }
};

exports.handleWebhook = async (req, res, next) => {
  try {
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
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  const { reference, bookingId } = req.body;

  try {
    const paymentData = await PaymentService.verify(reference);

    if (paymentData.status === 'success') {
      await BookingService.updateBookingStatus({
        bookingId,
        status: 'Paid',
        user: req.user,
      });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
