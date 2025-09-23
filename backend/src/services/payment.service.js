const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');

const BookingModel = require('../models/booking.model');
const PaymentModel = require('../models/payment.model');

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
        callback_url: `${process.env.FRONTEND_URL}/payment/callback?bookingId=${bookingId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    await BookingModel.storePaymentId({
      paymentId: response.data.data.reference,
      bookingId,
    });

    return response.data.data;
  }

  static async storePayment({ bookingId, amount, status }) {
    const id = uuidv4();
    await PaymentModel.storePayment({ id, bookingId, amount, status });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'mailshegze@gmail.com',
      from: 'oluwasegun.o.ige@gmail.com',
      subject: 'Payment Confirmation',
      text: `Your payment of ₦${amount} for booking ID ${bookingId} was successful.`,
      html: `<strong>Your payment of ₦${amount} for booking ID ${bookingId} was successful.</strong>`,
    };
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

module.exports = PaymentService;
