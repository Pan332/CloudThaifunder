import request from 'supertest';
import app from '../../../src/backend/server.js';
import connection from '../../../src/backend/db.js';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/backend/db.js');

describe('Donation Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should record a donation successfully', async () => {
    const mockDonation = {
      amount: 100,
      transaction_id: 'tx12345',
    };

    connection.execute
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ email: 'testuser@example.com' }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 1 });
      });

    const token = jwt.sign({ user_id: 1 }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const campaign_id = 1; // Explicitly define campaign_id

    const response = await request(app)
      .post(`/promptpay/donation/${campaign_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(mockDonation);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Donation recorded successfully');
    expect(response.body.donation_id).toBeDefined();
  });

  it('should return an error if the user is not found', async () => {
    const mockDonation = {
      amount: 100,
      transaction_id: 'tx12345',
    };
    const campaign_id = 1;

    connection.execute.mockImplementationOnce((sql, params, callback) => {
      callback(null, []);
    });

    const token = jwt.sign({ user_id: 1 }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .post(`/promptpay/donation/${campaign_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(mockDonation);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should return an error if donation insertion fails', async () => {
    const mockDonation = {
      amount: 100,
      transaction_id: 'tx12345',
    };
    const campaign_id = 1;

    connection.execute
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ email: 'testuser@example.com' }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

    const token = jwt.sign({ user_id: 1 }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .post(`/promptpay/donation/${campaign_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(mockDonation);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error inserting donation');
  });

  it('should return error for invalid JWT token', async () => {
    const mockDonation = {
      amount: 100,
      transaction_id: 'tx12345',
    };
    const campaign_id = 1;
    const invalidToken = 'invalidToken';

    const response = await request(app)
      .post(`/promptpay/donation/${campaign_id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(mockDonation);

    expect(response.status).toBe(403); // Expecting Forbidden
    expect(response.body.success).toBe(false); // Or check specific error message
    expect(response.body.message).toBe('Forbidden'); // Check for specific message
  });
});
