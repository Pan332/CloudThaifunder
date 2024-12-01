import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from '../db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Check for required secrets
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('Missing token secrets in environment variables');
}

// Function to generate access token
export const jwtGenerate = (user) => {
  const expiresIn = Math.floor(Date.now() / 1000) + 30 * 60;
  return jwt.sign(
    { username: user.username, user_id: user.user_id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { algorithm: "HS256", expiresIn: '30m' }
  );
}

// Function to generate refresh token
export const jwtRefreshTokenGenerate = (user) => {
  return jwt.sign(
    { username: user.username, user_id: user.user_id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { algorithm: "HS256", expiresIn: '15h' }
  );
}

// Middleware to validate access token
export const jwtValidate = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  });
};

// Middleware to validate refresh token
export const jwtRefreshTokenValidate = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = { ...decoded, token };
    delete req.user.exp;
    delete req.user.iat;
    next();
  });
};

// Validate the user for token refresh
export const validateUser = (req, res) => {
  const user = users.find(e => e.user_id === req.user.user_id && e.username === req.user.username);
  const userIndex = users.findIndex(e => e.refresh === req.user.token);

  if (!user || userIndex < 0) return res.sendStatus(401);

  const access_token = jwtGenerate(user);
  const refresh_token = jwtRefreshTokenGenerate(user);
  users[userIndex].refresh = refresh_token;

  return res.json({
    access_token,
    refresh_token,
  });
};

// User login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ensure username and password are provided
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Error executing query' });
      }

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (isPasswordValid) {
        const access_token = jwtGenerate(user); // Generate JWT token (replace with your token generation method)
        const refresh_token = jwtRefreshTokenGenerate(user); // Generate refresh token

        return res.status(200).json({
          success: true,
          access_token,
          refresh_token,
          role: user.role,
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
    });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Refresh token
export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token not provided' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid refresh token' });

    const accessToken = jwtGenerate(decoded);
    res.status(200).json({ success: true, accessToken });
  });
};

// User registration
export const register = async (req, res) => {
  const { username, email, password, role, phone, firstname, lastname } = req.body;

  try {
    // Check if username or email already exists
    connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ success: false, message: 'Error executing query' });
      }
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Username or email already exists' });
      }

      // Hash password and insert new user
      const hashedPassword = await bcrypt.hash(password, 10);
      connection.query('INSERT INTO users (username, email, password_hash, role, phone, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [username, email, hashedPassword, role, phone, firstname, lastname],
        (err) => {
          if (err) {
            console.error('Error executing insert query:', err);
            return res.status(500).json({ success: false, message: 'Error executing query' });
          }
          res.status(201).json({ success: true, message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};