import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const isValidatorOrAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token is missing' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role !== 'validator' && decoded.role !== 'admin')
        {
        return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
      }
      req.user = decoded; // Store decoded user info for further use
      next(); // Allow access to the intended route
    } catch (error) {
      console.error('Authorization error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      res.status(500).json({ success: false, message: 'Authorization failed' });
    }
  };