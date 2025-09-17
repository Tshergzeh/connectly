const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const pool = require('../../src/config/db');
const { resetDb, seedData } = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET;

describe('Booking API - Provider endpoints', () => {
  let providerToken;
  let customerToken;
  let providerId;
  let customerId;
  let serviceId;

  beforeAll(async () => {
    await resetDb();
    const seed = await seedData();
    customerId = seed.customerId;
    providerId = seed.providerId;
    serviceId = seed.serviceId;
    bookingId = seed.bookingId;

    customerToken = jwt.sign({ id: customerId, email: 'customer@test.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    providerToken = jwt.sign({ id: providerId, email: 'provider@test.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should fetch all bookings for a provider', async () => {
    const res = await request(app)
      .get('/api/bookings/provider')
      .set('Authorization', `Bearer ${providerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].service.id).toBe(serviceId);
  });

  it('should fetch bookings by provider and status', async () => {
    const res = await request(app)
      .get('/api/bookings/provider/Pending')
      .set('Authorization', `Bearer ${providerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].status).toBe('Pending');
  });

  it('should return 500 if status is invalid', async () => {
    const res = await request(app)
      .get('/api/bookings/provider/InvalidStatus')
      .set('Authorization', `Bearer ${providerToken}`);

    expect(res.status).toBe(500);
  });

  it('should not allow customers to access provider bookings', async () => {
    const res = await request(app)
      .get('/api/bookings/provider')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(500);
  });
});
