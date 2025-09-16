const pool = require('../config/db');

class ReviewModel {
  static async createReview({ id, bookingId, rating, comment }) {
    const createReviewQueryResult = await pool.query(
      `INSERT INTO reviews (id, booking_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [id, bookingId, rating, comment]
    );
    return createReviewQueryResult.rows[0];
  }

  static async getReviewsByService({ serviceId }) {
    const getReviewsByServiceQueryResult = await pool.query(
      `SELECT r.*, u.name AS customer_name
            FROM reviews r
            JOIN bookings b ON r.booking_id = b.id
            JOIN users u ON b.customer_id = u.id
            WHERE b.service_id = $1
            ORDER BY r.created_at DESC`,
      [serviceId]
    );
    return getReviewsByServiceQueryResult.rows;
  }
}

module.exports = ReviewModel;
