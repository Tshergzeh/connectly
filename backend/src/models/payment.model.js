const pool = require('../config/db');

class PaymentModel {
  static async storePayment({ id, bookingId, amount, status }) {
    const result = await pool.query(
      `INSERT INTO payments(id, booking_id, amount, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [id, bookingId, amount, status]
    );
    return result.rows[0];
  }
}

module.exports = PaymentModel;
