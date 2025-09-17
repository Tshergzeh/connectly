const axios = require('axios');

const BookingModel = require('../models/booking.model');

class PaymentService {
  static async initialisePayment({ bookingId, customerEmail, customerId, amount }) {
    const booking = await BookingModel.getBookingById(bookingId);

    if (booking.customer_id !== customerId) {
      throw new Error('Not authorized to pay for this booking');
    }

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: customerEmail,
        amount: amount * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  }
}

module.exports = PaymentService;
