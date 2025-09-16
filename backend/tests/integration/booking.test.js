const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const pool = require('../../src/config/db');
const { resetDb, seedData } = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET;

describe('Booking API', () => {
  let token;
  let customerId;
  let serviceId;
  let bookingId;

  beforeAll(async () => {
    await resetDb();
    const seed = await seedData();
    customerId = seed.customerId;
    serviceId = seed.serviceId;
    bookingId = seed.bookingId;

    token = jwt.sign({ id: customerId, email: 'customer@test.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/bookings/:id', () => {
    it('should create a booking', async () => {
      const res = await request(app)
        .post(`/api/bookings/${serviceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.booking).toHaveProperty('id');
      expect(res.body.booking.service_id).toBe(serviceId);
    });
  });

  describe('GET /api/bookings', () => {
    it('should list bookings for a customer', async () => {
      const res = await request(app).get('/api/bookings').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('service');
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should fetch a booking by ID', async () => {
      const res = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(bookingId);
    });
  });

  describe('PATCH /api/bookings/:id', () => {
    it('should update booking status', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Completed' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Completed');
    });
  });
});
