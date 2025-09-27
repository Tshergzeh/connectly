const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');

const AppError = require('../utils/AppError');
const BookingModel = require('../models/booking.model');
const PaymentModel = require('../models/payment.model');
const UserModel = require('../models/user.model');
const ServiceModel = require('../models/service.model');

class PaymentService {
  static async initialisePayment({ bookingId, customerEmail, customerId, amount }) {
    const booking = await BookingModel.getBookingById(bookingId);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.customer_id !== customerId) {
      throw new AppError('Not authorized to pay for this booking', 403);
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

    const booking = await BookingModel.getBookingById(bookingId);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    const customerId = booking.customer_id;
    const customerEmail = (await UserModel.findUserById(customerId)).email;
    console.log('Customer Email:', customerEmail);

    const serviceId = booking.service_id;
    const service = await ServiceModel.getServiceById(serviceId);
    const providerId = service.provider_id;
    const providerEmail = (await UserModel.findUserById(providerId)).email;
    console.log('Provider Email:', providerEmail);

    const customerMsg = {
      to: customerEmail,
      from: 'oluwasegun.o.ige@gmail.com',
      subject: 'Payment Confirmation',
      text: `Your payment of ₦${amount} for booking ID ${bookingId} was successful.`,
      html: `<strong>Your payment of ₦${amount} for booking ID ${bookingId} was successful.</strong>`,
    };

    const providerMsg = {
      to: providerEmail,
      from: 'oluwasegun.o.ige@gmail.com',
      subject: 'New Payment Received',
      text: `A payment of ₦${amount} has been made for booking ID ${bookingId}.`,
      html: `<strong>A payment of ₦${amount} has been made for booking ID ${bookingId}.</strong>`,
    };

    const msgs = [customerMsg, providerMsg];

    for (const msg of msgs) {
      try {
        await sgMail.send(msg);
        console.log('Email sent successfully to', msg.to);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  }

  static async verify(reference) {
    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error verifying payment:', error?.response?.data || error.message);
      throw new AppError('Failed to verify payment', 500);
    }
  }
}

module.exports = PaymentService;
