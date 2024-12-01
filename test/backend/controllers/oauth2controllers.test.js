import request from 'supertest';
import app from '../../../src/backend/server.js';
import connection from '../../../src/backend/db.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/backend/db.js');  // Mock the database connection
jest.mock('bcryptjs');  // Mock bcryptjs
jest.mock('jsonwebtoken'); // Mock jsonwebtoken


describe('Google OAuth Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should handle successful login for existing user', async () => {
        const mockUser = {
            user_id: 1,
            username: 'testuser',
            email: 'test@example.com',
        };
        const reqBody = {
            email: 'test@example.com',
            name: 'Test User',
        };

        connection.query.mockImplementation((query, values, callback) => {
            if (query.includes('SELECT * FROM users WHERE email = ?')) {
              callback(null, [{...mockUser}]);  // Mock existing user
            }
            else{
              callback(new Error("Incorrect query"), null); //handle unexpected query
            }

        });



        const response = await request(app)
            .post('/Oauth2/google/callback') // Assuming this route is defined
            .send(reqBody);

        expect(response.status).toBe(200); // Expect OK status
        expect(response.body.user_id).toBe(mockUser.user_id);
        expect(response.body).not.toHaveProperty('password_hash'); // Ensure no password hash in response

    });


    it('should handle successful login for new user', async () => {
        const reqBody = {
          email: 'newuser@example.com', // new user
          name: 'New User',
          photo: 'new_photo_url',
        };

        bcryptjs.hashSync.mockReturnValue('mockedHashedPassword');
        connection.query
          .mockImplementationOnce((query, values, callback) => { // Mock for SELECT query (no user found)

                callback(null, []);
            })
          .mockImplementationOnce((query, values, callback) => { //Mock for INSERT query

                callback(null, { insertId: 2 });  // Return id 2 for new user
            });
        jwt.sign.mockReturnValue('mockJWT');



        const response = await request(app)
            .post('/Oauth2/google/callback')
            .send(reqBody);

        expect(response.status).toBe(200);
        expect(response.body.user_id).toBe(2); //Check if the new id match
        expect(response.body).not.toHaveProperty('password_hash'); // Ensure no password hash
        expect(bcryptjs.hashSync).toHaveBeenCalled(); // Ensure hashing is done for new users


    });



    it('should handle database errors gracefully', async () => {
        const reqBody = { email: 'test@example.com', name: 'Test', photo: 'photo-url' }; // Example request body

        connection.query.mockImplementation((query, values, callback) => {

                callback(new Error('Database error'), null);
            });
        const response = await request(app)
            .post('/Oauth2/google/callback')
            .send(reqBody);


        expect(response.status).toBe(500); // Expecting Internal Server Error

    });



  it('should handle sign-out', async () => {

    const response = await request(app).post("/Oauth2/signout");
    expect(response.status).toBe(200);
    expect(response.body).toBe('User has been logged out!');

  });


});