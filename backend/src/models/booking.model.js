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

  static async getBookingsByCustomer({ customerId, limit = 10, cursor = null }) {
    let query = `
      SELECT 
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
    `;

    const params = [customerId];

    if (cursor) {
      query += ` AND b.created_at < $2`;
      params.push(cursor);
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${params.length + 1};`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getBookingById(bookingId) {
    const getBookingByIdQueryResult = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
      bookingId,
    ]);
    return getBookingByIdQueryResult.rows[0];
  }

  static async getBookingByReference(reference) {
    const result = await pool.query(`SELECT * FROM bookings WHERE payment_id = $1`, [reference]);
    return result.rows[0];
  }

  static async updateBookingStatus({ bookingId, status }) {
    const updateBookingStatusQueryResult = await pool.query(
      `UPDATE bookings
        SET status = $2, updated_at = now()
        WHERE id = $1
        RETURNING *`,
      [bookingId, status]
    );
    return updateBookingStatusQueryResult.rows[0];
  }

  static async getBookingsByProvider({ providerId, limit = 10, cursor = null }) {
    let query = `
      SELECT 
        services.provider_id, 
        services.title,
        services.price,
        bookings.id, 
        bookings.service_id, 
        bookings.customer_id, 
        users.name,
        users.email,
        bookings.status, 
        bookings.payment_id, 
        bookings.created_at, 
        bookings.updated_at
      FROM bookings
      JOIN services
      ON bookings.service_id = services.id
      JOIN users
      ON bookings.customer_id = users.id
      WHERE provider_id = $1
    `;

    const params = [providerId];

    if (cursor) {
      query += ` AND bookings.created_at < $2`;
      params.push(cursor);
    }

    query += ` ORDER BY bookings.created_at DESC LIMIT $${params.length + 1};`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getBookingsByProviderAndStatus({ providerId, status, limit = 10, cursor }) {
    let query = `
      SELECT 
        services.provider_id, 
        services.title,
        services.price,
        bookings.id, 
        bookings.service_id, 
        bookings.customer_id, 
        users.name,
        users.email,
        bookings.status, 
        bookings.payment_id, 
        bookings.created_at, 
        bookings.updated_at
      FROM bookings
      JOIN services
      ON bookings.service_id = services.id
      JOIN users
      ON bookings.customer_id = users.id
      WHERE provider_id = $1
      AND status = $2
    `;

    const params = [providerId, status];

    if (cursor) {
      query += ` AND bookings.created_at < $3`;
      params.push(cursor);
    }

    query += ` ORDER BY bookings.created_at DESC LIMIT $${params.length + 1};`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async deletePendingBookingById(bookingId) {
    const deletePendingBookingByIdQueryResult = await pool.query(
      `DELETE FROM bookings WHERE id = $1 AND status = 'Pending' RETURNING *`,
      [bookingId]
    );
    return deletePendingBookingByIdQueryResult.rows[0];
  }

  static async storePaymentId({ paymentId, bookingId }) {
    const result = await pool.query(`UPDATE bookings SET payment_id = $1 WHERE id = $2`, [
      paymentId,
      bookingId,
    ]);
    return result.rows[0];
  }
}

module.exports = BookingModel;
