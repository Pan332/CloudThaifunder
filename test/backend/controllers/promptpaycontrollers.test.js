import request from 'supertest';
import app from '../../../src/backend/server.js';
import connection from '../../../src/backend/db.js';
import QRCode from 'qrcode';
import generatePayload from 'promptpay-qr';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/backend/db.js');
jest.mock('qrcode');
jest.mock('promptpay-qr');
jest.mock('jsonwebtoken');

describe('PromptPay QR Generation Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const generateValidRequest = (campaign_id, amount, user) => {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        return request(app)
            .post(`/promptpay/generateQR/${campaign_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ amount, id: campaign_id.toString() }); // Stringify campaign_id
    };


    it('should generate a PromptPay QR code successfully', async () => {
        const campaign_id = 1;
        const amount = 100;
        const phoneNumber = '0812345678';

        connection.execute.mockImplementation((sql, params, callback) => {
            console.log("Mock connection.execute called with SQL:", sql, "and params:", params);
            callback(null, [{ phone_number: phoneNumber }]);
        });

        QRCode.toDataURL.mockImplementation((payload, options, callback) => {
            callback(null, 'mocked-qr-code-url');
        });

        generatePayload.mockReturnValue('mocked-promptpay-payload');

        const user = { user_id: 1, role: 'user' };
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, user);
        });

        const response = await generateValidRequest(campaign_id, amount, user);

        console.log("Response body:", response.body);
        console.log("Response status:", response.status);

        expect(response.status).toBe(200);
        expect(response.body.RespCode).toBe(200);
        expect(response.body.RespMessage).toBe('QR code generated successfully.');
        expect(response.body.Result).toBe('mocked-qr-code-url');
    });

    it('should handle invalid amount', async () => {
        const campaign_id = 1;
        const invalidAmounts = [-100, 0, 'abc', null, undefined]; // Invalid amounts to test
        const user = { user_id: 1, role: 'user' };
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

        jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, user); // Mock valid token for this test
            });
    
        for (const amount of invalidAmounts) {
          const response = await generateValidRequest(campaign_id, amount, user);
          expect(response.status).toBe(400);
          expect(response.body.RespCode).toBe(400);
          expect(response.body.RespMessage).toBe('Invalid amount provided.');
        }
      });
     
    it('should handle campaign not found', async () => {
        const campaign_id = 999; // Non-existent campaign ID
        const amount = 100;
        const user = { user_id: 1, role: 'user' };
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, user);
        });


        connection.execute.mockImplementation((sql, params, callback) => {
            callback(null, []); // Simulate no campaign found
        });

        const response = await generateValidRequest(campaign_id, amount, user);

        expect(response.status).toBe(404);
        expect(response.body.RespCode).toBe(404);
        expect(response.body.RespMessage).toBe('Campaign not found');

    });
    
    it('should handle database error', async () => {
        const campaign_id = 1;
        const amount = 100;

        connection.execute.mockImplementation((sql, params, callback) => {
            callback(new Error('Database error'), null); 
        });

        const response = await generateValidRequest(campaign_id, amount); //No user arg needed

        expect(response.status).toBe(500);
        expect(response.body.RespCode).toBe(500);
        expect(response.body.RespMessage).toBe('Database error.'); // Check the right property

    });
});