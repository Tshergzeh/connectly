const pool = require('../config/db');

class ServiceModel {
  static async createService({ id, provider_id, title, description, price, category, image }) {
    const result = await pool.query(
      `INSERT INTO services
            (id, provider_id, title, description, price, category, image)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
      [id, provider_id, title, description, price, category, image]
    );
    return result.rows[0];
  }

  static async getAllServices() {
    const result = await pool.query(
      `SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS review_count
      FROM services s
      LEFT JOIN bookings b ON b.service_id = s.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      GROUP BY s.id
      ORDER BY created_at DESC;`
    );
    return result.rows;
  }

  static async getServiceById(id) {
    const result = await pool.query(
      `SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS review_count
      FROM services s
      LEFT JOIN bookings b ON b.service_id = s.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      WHERE s.id = $1
      GROUP BY s.id
      ORDER BY created_at DESC;`,
      [id]
    );
    return result.rows[0];
  }

  static async updateService(id, { title, description, price, category, image, is_active }) {
    const result = await pool.query(
      `UPDATE services
            SET title = $1,
                description = $2,
                price = $3,
                category = $4,
                image = $5,
                is_active = $6,
                updated_at = now()
            WHERE id = $7
            RETURNING *`,
      [title, description, price, category, image, is_active, id]
    );
    return result.rows[0];
  }

  static async deleteService(id) {
    const result = await pool.query(`DELETE FROM services WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
  }
}

module.exports = ServiceModel;
