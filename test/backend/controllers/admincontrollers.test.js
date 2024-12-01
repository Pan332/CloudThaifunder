import request from 'supertest';
import app from '../../../src/backend/server.js';
import connection from '../../../src/backend/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
jest.mock('../../../src/backend/db.js');
jest.mock('jsonwebtoken');
jwt.verify.mockReturnValue({ user_id: 1, role: 'admin' });

afterAll(async () => {
  if (connection) {
    await connection.end();
  }

  if (app && typeof app.close === 'function') {
    await new Promise((resolve, reject) => {
      app.close((err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  jest.clearAllTimers();
});



describe('Admin Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test cases for GET /admin/getAlluser
  describe('GET /admin/getAlluser', () => {
    const token = 'mocked-token';
    it('should fetch all users', async () => {
      const mockUserData = [
        {
          user_id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          role: 'user',
          phone: '1234567890',
          first_name: 'John',
          last_name: 'Doe',
          age: '24',
          gender: 'male',
          address: '123 Main Street',
          city: 'Bangkok',
          postcode: '10120',
          total_campaigns: 3,
          total_earnings: 1500,
        },
      ];

      connection.query.mockImplementation((query, callback) => {
        callback(null, mockUserData);
      });

      const response = await request(app)
        .get('/admin/getAlluser')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.userResults).toEqual(mockUserData);
    });

    it('should handle database errors', async () => {
      connection.query.mockImplementation((query, callback) => {
        callback(new Error('Database error'), null);
      });
      const response = await request(app)
        .get('/admin/getAlluser')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  // Test cases for GET /admin/PendingCampaigns
  describe('GET /admin/PendingCampaigns', () => {
    it('should fetch all pending campaigns successfully', async () => {
      const token = 'mocked-token';
      const mockPendingCampaigns = [
        {
          campaign_id: 1,
          title: 'Plant Trees',
          description: 'Help us plant trees worldwide',
          short_description: 'abc',
          goal_amount: 50000,
          raised_amount: 0,
          status: 'pending',
          deadline: '2024-12-31',
          image: 'tree.jpg',
          first_name: 'John',
          campaign_tag: 'Environment',
        },
      ];

      connection.query.mockImplementation((query, callback) => {
        callback(null, mockPendingCampaigns);
      });

      const response = await request(app)
        .get('/admin/PendingCampaigns')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns).toEqual(mockPendingCampaigns);
    });

    it('should handle errors while fetching pending campaigns', async () => {
      const token = 'mocked-token';
      connection.query.mockImplementation((query, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app)
        .get('/admin/PendingCampaigns')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  // Test cases for PUT /editInfo
  describe('PUT /admin/editInfo/:id', () => {
    it('should update user information successfully', async () => {
      const token = 'mocked-token';
      const updatedUser = {
        user_id: 1,
        username: 'john_doe_updated',
        email: 'john_updated@example.com',
        role: 'user',
      };

      connection.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app)
        .put('/admin/editInfo/:id')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User info updated successfully');
    });

    it('should handle errors while updating user information', async () => {
      const token = 'mocked-token';
      const updatedUser = {
        user_id: 1,
        username: 'john_doe_updated',
        email: 'john_updated@example.com',
        role: 'user',
      };

      connection.query.mockImplementation((query, values, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app)
        .put('/admin/editInfo/:id')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUser);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  // Test cases for DELETE /deleteUser
  describe('DELETE /admin/deleteUser/:id', () => {
    it('should delete a user successfully', async () => {
      const token = 'mocked-token';
      const userId = 1;

      connection.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app)
        .delete(`/admin/deleteUser/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should handle errors while deleting a user', async () => {
      const token = 'mocked-token';
      const userId = 1;

      connection.query.mockImplementation((query, values, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app)
        .delete(`/admin/deleteUser/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });
});
describe(`GET /admin/getAllcampaigns`, () => {
  it(`should fetch all campaigns`, async () => {
    const mockCampaignData = [
      {
        campaign_id: 1,
        title: `Save the Whales`,
        description: `Help us save the whales`,
        goal_amount: 5000,
        raised_amount: 2000,
        status: `active`,
      },
    ];

    connection.query.mockImplementation((query, callback) => {
      callback(null, mockCampaignData);
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .get(`/admin/getAllcampaigns`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.campaigns).toEqual(mockCampaignData);
  });

  it(`should handle errors when fetching campaigns`, async () => {
    connection.query.mockImplementation((query, callback) => {
      callback(new Error(`Database error`), null);
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .get(`/admin/getAllcampaigns`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(`Internal server error`);
  });
});

// Test cases for hideCampaigns
describe(`PUT /admin/hideCampaigns/:id`, () => {
  it(`should update campaign status successfully`, async () => {
    connection.query
      .mockImplementationOnce((query, values, callback) => {
        callback(null, [{ status: `active` }]); // Simulate current campaign status
      })
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 1 }); // Simulate successful update
      });

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/hideCampaigns/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: `deleted` });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(`Campaign status updated successfully`);
  });

  it(`should not update if campaign is already deleted`, async () => {
    connection.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ status: `deleted` }]); // Simulate already deleted campaign
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/hideCampaigns/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: `deleted` });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(`This campaign is already deleted`);
  });

  it(`should handle errors when checking campaign status`, async () => {
    connection.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error(`Database error`), null);
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/hideCampaigns/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: `deleted` });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(`Internal server error`);
  });
});

// Test cases for deleteCampaign
describe(`PUT /admin/deleteCampaign/:id`, () => {
  it(`should delete a campaign successfully (soft delete)`, async () => {
    connection.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/deleteCampaign/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: `deleted` });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(`Campaign deleted successfully`);
  });

  it(`should handle errors during deletion`, async () => {
    connection.query.mockImplementation((query, values, callback) => {
      callback(new Error(`Database error`), null);
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/deleteCampaign/1`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: `deleted` });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(`Error deleting campaign`);
  });
});

// Test cases for PendingCampaigns
describe(`GET /admin/PendingCampaigns`, () => {
  it(`should fetch all pending campaigns successfully`, async () => {
    const mockPendingCampaigns = [
      {
        campaign_id: 1,
        title: `Plant Trees`,
        description: `Help us plant trees worldwide`,
        short_description: 'abc',
        goal_amount: 50000,
        raised_amount: 0,
        status: `pending`,
        deadline: '2024-12-31',
        image: 'tree.jpg',
        first_name: 'John',
        campaign_tag: 'Environment',
      },
    ];

    connection.query.mockImplementation((query, callback) => {
      callback(null, mockPendingCampaigns);
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .get(`/admin/PendingCampaigns`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.campaigns).toEqual(mockPendingCampaigns);
  });

  it(`should handle errors while fetching pending campaigns`, async () => {
    connection.query.mockImplementation((query, callback) => {
      callback(new Error(`Database error`), null);
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .get(`/admin/PendingCampaigns`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(`Internal server error`);
  });
});

// Test cases for ValidateCampaigns
describe(`PUT /admin/ValidateCampaigns/:id`, () => {
  it(`should validate a campaign successfully`, async () => {
    connection.query
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 1 }); // Simulate campaign update
      })
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 1 }); // Simulate insertion of verification record
      });

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/ValidateCampaigns/:id`)
      .set('Authorization', `Bearer ${token}`)
      .send({ campaign_id: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(`Campaign verified successfully`);
  });

  it(`should handle validation errors`, async () => {
    jwt.verify.mockReturnValue({ user_id: 1, role: `user` }); // Unauthorized role

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/ValidateCampaigns/:id`)
      .set('Authorization', `Bearer ${token}`)
      .send({ campaign_id: 1 });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(`Access denied: Admins only`);
  });

  it(`should handle errors during campaign validation`, async () => {
    jwt.verify.mockReturnValue({ user_id: 1, role: `admin` });
    connection.query.mockImplementationOnce((query, values, callback) => { 
      callback(new Error(`Database error`), null); // Simulate error in campaign update
    });

    const token = 'mockValidToken';
    const response = await request(app)
      .put(`/admin/ValidateCampaigns/:id`)
      .set('Authorization', `Bearer ${token}`)
      .send({ campaign_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(`Failed to update campaign status`);
  });
});

