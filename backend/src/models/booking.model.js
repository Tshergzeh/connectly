const pool = require('../config/db');

class BookingModel {
  static async createBooking({ id, serviceId, customerId, status }) {
    const createBookingQueryResult = await pool.query(
      `INSERT INTO bookings (id, service_id, customer_id, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [id, serviceId, customerId, status]
    );
    return createBookingQueryResult.rows[0];
  }

  static async getBookingsByCustomer({ customerId }) {
    console.log(customerId);
    const getBookingsByCustomerQueryResult = await pool.query(
      `SELECT 
        b.id AS booking_id,
        b.status,
        b.created_at,
        b.updated_at,
        s.id AS service_id,
        s.title,
        s.description,
        s.price,
        s.image,
        r.id AS review_id,
        r.rating,
        r.comment,
        r.created_at AS review_created_at
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC;`,
      [customerId]
    );
    return getBookingsByCustomerQueryResult.rows;
  }

  static async getBookingById(bookingId) {
    const getBookingByIdQueryResult = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
      bookingId,
    ]);
    return getBookingByIdQueryResult.rows[0];
  }

  static async updateBookingStatus({ bookingId, status }) {
    console.log(bookingId);
    console.log(status);
    const updateBookingStatusQueryResult = await pool.query(
      `UPDATE bookings
        SET status = $2, updated_at = now()
        WHERE id = $1
        RETURNING *`,
      [bookingId, status]
    );
    return updateBookingStatusQueryResult.rows[0];
  }

  static async getBookingsByProvider({ providerId }) {
    const getBookingsByProviderQueryResult = await pool.query(
      `SELECT 
            services.provider_id, 
            bookings.id, 
            bookings.service_id, 
            bookings.customer_id, 
            bookings.status, 
            bookings.payment_id, 
            bookings.created_at, 
            bookings.updated_at
        FROM public.bookings
        JOIN public.services
        ON bookings.service_id = services.id
        WHERE provider_id = $1
        ORDER BY created_at DESC `,
      [providerId]
    );
    return getBookingsByProviderQueryResult.rows;
  }

  static async getBookingsByProviderAndStatus({ providerId, status }) {
    const getBookingsByProviderQueryResult = await pool.query(
      `SELECT 
            services.provider_id, 
            bookings.id, 
            bookings.service_id, 
            bookings.customer_id, 
            bookings.payment_id, 
            bookings.status,
            bookings.created_at, 
            bookings.updated_at
        FROM public.bookings
        JOIN public.services
        ON bookings.service_id = services.id
        WHERE provider_id = $1
        AND status = $2
        ORDER BY created_at DESC `,
      [providerId, status]
    );
    return getBookingsByProviderQueryResult.rows;
  }
}

module.exports = BookingModel;
