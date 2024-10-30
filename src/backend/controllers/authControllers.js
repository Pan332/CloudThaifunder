// controllers/authControllers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from '../db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const validateUser = (req, res) => {
  const user = users.find((e) => e.user_id === req.user.user_id && e.username === req.user.username);
  const userIndex = users.findIndex((e) => e.refresh === req.user.token);

  if (!user || userIndex < 0) return res.sendStatus(401);

  const access_token = jwtGenerate(user);
  const refresh_token = jwtRefreshTokenGenerate(user);
  users[userIndex].refresh = refresh_token;

  return res.json({
    access_token,
    refresh_token,
  });
};

export const jwtRefreshTokenValidate = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = decoded;
      req.user.token = token;
      delete req.user.exp;
      delete req.user.iat;
    });
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

export const jwtValidate = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: 'Token not provided' });
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

export const login = async (req, res) => {
    const jwtGenerate = (user) => jwt.sign(
      { username: user.username, user_id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m", algorithm: "HS256" }
    );
  
    const jwtRefreshTokenGenerate = (user) => jwt.sign(
      { username: user.username, user_id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d", algorithm: "HS256" }
    );
  
    try {
      const { username, password } = req.body;
      connection.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) {
          console.error('Database error:', err); // Improved error logging
          return res.status(500).json({ success: false, message: 'Error executing query' });
        }
  
        if (results.length === 0) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
  
        const user = results[0];
        // Verify password
        if (await bcrypt.compare(password, user.password_hash)) {
          const access_token = jwtGenerate(user);
          const refresh_token = jwtRefreshTokenGenerate(user);
          res.status(200).json({ success: true, access_token, refresh_token });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid password' });
        }
      });
    } catch (error) {
      console.error('Internal server error:', error); // Improved error logging
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token not provided' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid refresh token' });

    const accessToken = jwt.sign({ user_id: decoded.user_id, username: decoded.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.status(200).json({ success: true, accessToken });
  });
};

export const register = async (req, res) => {
    const { username, password, firstname, lastname, phone, email, role } = req.body; // Ensure 'role' is included
  
    try {
      // Check for existing username
      connection.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) {
          console.error('Error executing query:', err); // Log SQL errors
          return res.status(500).json({ success: false, message: 'Error executing query' });
        }
        if (results.length > 0) {
          return res.status(400).json({ success: false, message: 'Username already exists' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert new user into the database
        connection.query('INSERT INTO Users (username, password_hash, email, role) VALUES (?, ?, ?, ?)', 
          [username, hashedPassword, email, role], // Ensure only 4 values for 4 placeholders
          (err) => {
            if (err) {
              console.error('Error executing insert query:', err); // Log insert errors
              return res.status(500).json({ success: false, message: 'Error executing query' });
            }
            res.status(201).json({ success: true, message: 'User registered successfully' });
          }
        );
      });
    } catch (error) {
      console.error('Internal Server Error:', error); // Log unexpected errors
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };


  