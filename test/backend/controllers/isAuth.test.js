import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../../../src/backend/middleware/backend/isAuth.js';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('jsonwebtoken');

describe('isAuthenticated Middleware', () => {
  const mockNext = jest.fn();
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    const mockReq = { headers: {} }; // No authorization header

    isAuthenticated(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unauthorized',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if token verification fails', () => {
    const mockReq = {
      headers: { authorization: 'Bearer invalidToken' },
    };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    isAuthenticated(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', () => {
    const mockUser = { user_id: 1, role: 'admin' };
    const mockReq = {
      headers: { authorization: 'Bearer validToken' },
    };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    isAuthenticated(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(
      'validToken',
      process.env.ACCESS_TOKEN_SECRET,
      expect.any(Function)
    );
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully during token verification', () => {
    const mockReq = {
      headers: { authorization: 'Bearer validToken' },
    };
  
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Unexpected error'), null); // Pass error to callback
    });
  
    isAuthenticated(mockReq, mockRes, mockNext);
  
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
