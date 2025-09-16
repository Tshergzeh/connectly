const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

beforeAll(async () => {
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM refresh_tokens');
});

afterAll(async () => {
  await pool.end();
});

describe('Auth API', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    is_provider: true,
    is_customer: false,
  };

  let refreshToken;

  test('should register a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send(userData).expect(201);

    expect(res.body.message).toBe('User created successfully');
    expect(res.body.user.email).toBe(userData.email);
  });

  test('should login the user and set refresh token cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();

    expect(res.headers['set-cookie']).toBeDefined();
    refreshToken = res.headers['set-cookie'][0];
  });

  test('should refresh access token using refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', refreshToken)
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
  });

  test('should reject invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' })
      .expect(401);

    expect(res.body.error).toBe('Invalid email or password');
  });
});
