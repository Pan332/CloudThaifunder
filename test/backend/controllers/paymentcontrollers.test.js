import request from 'supertest';
import app from '../../../src/backend/server.js';
import connection from '../../../src/backend/db.js';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/backend/db.js');

describe('Payment Controller Tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should record a payment successfully', async () => {
        const mockPayment = {
            donation_id: 1,
            payment_method: 'PromptPay',
            transaction_id: 'tx12345',
        };
        const campaign_id = 1;


        connection.execute.mockImplementation((sql, params, callback) => {
            callback(null, { insertId: 1 });
        });

        const user_id = 1; // Replace with a valid user ID or mock req.user
        const token = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });



        const response = await request(app)
            .post(`/promptpay/payment/${campaign_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(mockPayment);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Payment recorded successfully');
        expect(response.body.payment_id).toBeDefined();
    });


    it('should return 500 if payment insertion fails', async () => {
        const mockPayment = {
            donation_id: 1,
            payment_method: 'PromptPay',
            transaction_id: 'tx12345',
        };

        const campaign_id = 1;

        connection.execute.mockImplementation((sql, params, callback) => {
            callback(new Error('Database insertion error'), null);
        });

        const user_id = 1;
        const token = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });


        const response = await request(app)
            .post(`/promptpay/payment/${campaign_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(mockPayment);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error inserting payment');

    });


    it('should return 403 for invalid JWT token', async () => {
        const mockPayment = {
          donation_id: 1,
          payment_method: 'PromptPay',
          transaction_id: 'tx12345',
        };
        const campaign_id = 1;
        const invalidToken = 'invalid-token';

        const response = await request(app)
          .post(`/promptpay/payment/${campaign_id}`)
          .set('Authorization', `Bearer ${invalidToken}`)
          .send(mockPayment);
    
        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Forbidden');
      });


});


