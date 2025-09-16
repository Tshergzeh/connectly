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
      `SELECT * FROM bookings 
            WHERE customer_id = $1 
            ORDER BY created_at DESC`,
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
}

module.exports = BookingModel;
