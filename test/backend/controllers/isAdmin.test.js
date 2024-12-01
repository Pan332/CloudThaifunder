import { verifyAdmin } from '../../../src/backend/middleware/backend/isAdmin.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('verifyAdmin Middleware', () => {
  const mockReq = {};
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.headers = {};
  });

  it('should return 401 if token is missing', () => {
    verifyAdmin(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access token is missing',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not an admin', () => {
    mockReq.headers.authorization = 'Bearer validToken';
    jwt.verify.mockImplementation(() => ({ role: 'user' })); // Simulate non-admin user

    verifyAdmin(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access denied: Admins only',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid tokens', () => {
    mockReq.headers.authorization = 'Bearer invalidToken';
    jwt.verify.mockImplementation(() => {
      throw { name: 'JsonWebTokenError' }; // Simulate invalid token error
    });

    verifyAdmin(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 500 for unexpected errors', () => {
    mockReq.headers.authorization = 'Bearer validToken';
    jwt.verify.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    verifyAdmin(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authorization failed',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if the user is an admin', () => {
    mockReq.headers.authorization = 'Bearer validToken';
    const mockDecoded = { role: 'admin', user_id: 1 };
    jwt.verify.mockImplementation(() => mockDecoded); // Simulate admin token

    verifyAdmin(mockReq, mockRes, mockNext);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockReq.user).toEqual(mockDecoded);
    expect(mockNext).toHaveBeenCalled();
  });
});
