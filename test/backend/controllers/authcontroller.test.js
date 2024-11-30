import request from 'supertest'; // To make HTTP requests in tests
import app from '../../../src/backend/server.js';
import connection from '../../../src/backend/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock the DB connection to avoid actual database operations during tests
jest.mock('../../../src/backend/db.js');

describe('Auth Controller Tests', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data between tests
  });

  // Test for user registration
  it('should register a new user', async () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      phone: '1234567890',
      firstname: 'John',
      lastname: 'Doe',
    };

    connection.query.mockImplementation((sql, params, callback) => {
      callback(null, []); // Simulate no existing users
    });

    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword'); // Mock bcrypt.hash

    const response = await request(app).post('/auth/signup').send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User registered successfully');
  });

  // Test for user login
  it('should login a user successfully', async () => {
    const mockUser = {
      username: 'testuser',
      password_hash: await bcrypt.hash('password123', 10), // Hash the password
      role: 'user',
    };

    // Mock the database query to simulate an existing user in the database
    connection.query.mockImplementation((sql, params, callback) => {
      if (sql.includes('SELECT * FROM users WHERE username = ?')) {
        callback(null, [mockUser]); // Return the mock user
      } else {
        callback(null, []); // Default callback
      }
    });

    // Send the login request
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',  // Correct password for mockUser
      });

    // Assertions to check if the login was successful
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.access_token).toBeDefined(); // Check that the access token is returned
    expect(response.body.refresh_token).toBeDefined(); // Check that the refresh token is returned
  });


  // Test for invalid login credentials
  it('should return error for invalid login credentials', async () => {
    const mockUser = {
      username: 'testuser',
      password_hash: await bcrypt.hash('password123', 10),
    };

    connection.query.mockImplementation((sql, params, callback) => {
      callback(null, [mockUser]); // Simulate existing user in the database
    });

    const response = await request(app).post('/auth/login').send({
      username: 'testuser',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid password');
  });

  // Test for refresh token
  it('should return a new access token for valid refresh token', async () => {
    const mockUser = {
      username: 'testuser',
      user_id: 1,
      role: 'user',
    };

    const refreshToken = jwt.sign(mockUser, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '15h',
    });

    const response = await request(app).post('/auth/refresh-token').send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toBeDefined();
  });

  // Test for invalid refresh token
  it('should return error for invalid refresh token', async () => {
    const invalidRefreshToken = 'invalidToken';

    const response = await request(app).post('/auth/refresh-token').send({ refreshToken: invalidRefreshToken });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  // Test for missing refresh token
  it('should return error for missing refresh token', async () => {
    const response = await request(app).post('/auth/refresh-token').send({});

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Refresh token not provided');
  });

  // Test for token validation middleware (jwtValidate)
  it('should allow access with valid token', async () => {
    const user = {
      username: 'testuser',
      user_id: 1,
      role: 'user',
    };

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    });

    const response = await request(app)
      .get('/auth/validate')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test for invalid token (jwtValidate)
  it('should return error for invalid token', async () => {
    const invalidToken = 'invalidToken';

    const response = await request(app)
      .get('/auth/validate')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Forbidden');
  });
});

