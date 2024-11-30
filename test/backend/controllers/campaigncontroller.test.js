import request from 'supertest';
import app from '../../../src/backend/server.js'; // Adjust the path to your server.js file
import connection from '../../../src/backend/db.js';

// Mock the DB connection
jest.mock('../../../src/backend/db.js');


describe('Campaign Controller Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for Create Campaign
  describe('POST /campaign/createcampaign', () => {
    it('should create a new campaign successfully', async () => {
      const mockUser = { user_id: 101 }; // Assuming user is authenticated
      const token = 'mocked-token';
      const campaignData = {
        
        title: 'Campaign Title',
        description: 'This is a campaign description',
        goal_amount: 1000,
        shortDescription: 'Short description',
        endDate: '2025-12-31',
        category: 'art',
        phone_number: '1234567890',
        imagePath: 'path/to/image.jpg',
      };

      connection.query.mockImplementation((sql, params, callback) => {
        if (sql.includes('SELECT category_id')) {
          callback(null, [{ category_id: 1 }]); // Mock the category check result
        } else if (sql.includes('INSERT INTO campaigns')) {
          callback(null, { insertId: 1 }); // Mock successful insertion
        } else if (sql.includes('INSERT INTO campaigncategorymapping')) {
          callback(null); // Mock successful category mapping insertion
        }
      });
   

      const response = await request(app)
        .post('/campaign/createcampaign')
        .set('Authorization', `Bearer ${token}`)
        .send(campaignData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Campaign created successfully');
      expect(response.body.campaign_id).toBe(1);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/campaign/createcampaign')
        .set('Authorization', 'Bearer valid_token')
        .send({}); // Empty request body

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Missing required fields');
    });
  });

  // Test for Edit Campaign
  describe('PUT /campaigns/:id', () => {
    it('should update a campaign successfully', async () => {
      const mockUser = { user_id: 1 };
      const campaignId = 1;
      const campaignData = {
        title: 'Updated Campaign Title',
        shortDescription: 'Updated Short Description',
        description: 'Updated description',
        phone_number: '0987654321',
      };

      connection.query.mockImplementation((sql, params, callback) => {
        if (sql.includes('SELECT * FROM campaigns')) {
          callback(null, [{ campaign_id: 1 }]); // Mock existing campaign
        } else if (sql.includes('UPDATE Campaigns')) {
          callback(null, { affectedRows: 1 }); // Mock successful update
        }
      });

      const response = await request(app)
        .put(`/campaigns/${campaignId}`)
        .set('Authorization', 'Bearer valid_token')
        .send(campaignData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Campaign updated successfully');
    });

    it('should return 400 if no fields are provided to update', async () => {
      const response = await request(app)
        .put('/campaigns/1')
        .set('Authorization', 'Bearer valid_token')
        .send({}); // No fields to update

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('At least one field is required for update');
    });

    it('should return 404 if campaign not found', async () => {
      const campaignId = 999; // Non-existent campaign ID

      connection.query.mockImplementation((sql, params, callback) => {
        if (sql.includes('SELECT * FROM campaigns')) {
          callback(null, []); // No campaign found
        }
      });

      const response = await request(app)
        .put(`/campaigns/${campaignId}`)
        .set('Authorization', 'Bearer valid_token')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Campaign not found');
    });
  });

  // Test for Get Campaigns
  describe('GET /campaigns', () => {
    it('should return a list of pending campaigns', async () => {
      connection.query.mockImplementation((sql, callback) => {
        if (sql.includes('SELECT * FROM campaigns')) {
          callback(null, [{ campaign_id: 1, title: 'Campaign 1' }]); // Mock campaigns data
        }
      });

      const response = await request(app).get('/campaigns');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.campaigns).toHaveLength(1);
      expect(response.body.campaigns[0].title).toBe('Campaign 1');
    });

    it('should return 500 if error fetching campaigns', async () => {
      connection.query.mockImplementation((sql, callback) => {
        callback(new Error('Database error')); // Mock database error
      });

      const response = await request(app).get('/campaigns');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error fetching campaigns');
    });
  });

  // Test for Delete Campaign
  describe('DELETE /campaigns', () => {
    it('should delete a campaign successfully', async () => {
      const campaignId = 1;

      connection.query.mockImplementation((sql, params, callback) => {
        if (sql.includes('UPDATE Campaigns')) {
          callback(null, { affectedRows: 1 }); // Mock successful soft delete
        }
      });

      const response = await request(app)
        .delete('/campaigns')
        .set('Authorization', 'Bearer valid_token')
        .send({ campaign_id: campaignId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Campaign deleted successfully');
    });

    it('should return 400 if campaign_id is missing', async () => {
      const response = await request(app)
        .delete('/campaigns')
        .set('Authorization', 'Bearer valid_token')
        .send({}); // Missing campaign_id

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Missing campaign ID');
    });
  });
});
