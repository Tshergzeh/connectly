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

  static async getAllServices({ limit = 10, cursor = null, filters = {} }) {
    let query = `
      SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS review_count
      FROM services s
      LEFT JOIN bookings b ON b.service_id = s.id
      LEFT JOIN reviews r ON r.booking_id = b.id
    `;

    const conditions = [];
    const params = [];

    if (cursor) {
      conditions.push(`s.created_at < $${params.length + 1}`);
      params.push(cursor);
    }

    if (filters.keyword) {
      conditions.push(
        `(s.title ILIKE $${params.length + 1} OR s.description ILIKE $${params.length + 1})`
      );
      params.push(`%${filters.keyword}%`);
    }

    if (filters.category) {
      conditions.push(`s.category == $${params.length + 1}`);
      params.push(filters.category);
    }

    if (filters.priceMin !== undefined) {
      conditions.push(`s.price >= $${params.length + 1}`);
      params.push(filters.priceMin);
    }

    if (filters.priceMax !== undefined) {
      conditions.push(`s.price <= $${params.length + 1}`);
      params.push(filters.priceMax);
    }

    query += conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

    query += ` GROUP BY s.id`;

    if (filters.ratingMin !== undefined) {
      query += ` HAVING COALESCE(AVG(r.rating), 0) >= $${params.length + 1}`;
      params.push(filters.ratingMin);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1};`;
    params.push(limit + 1);

    const result = await pool.query(query, params);
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
