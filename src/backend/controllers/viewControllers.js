import connection from '../db.js';
import jwt from 'jsonwebtoken';

const queryDatabase = (query, params) => {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  };

// Fetch user info
export const getUserInfo = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.user_id;

    connection.query('SELECT user_id, first_name, last_name, email, phone FROM users WHERE user_id = ?', [userId], (err, userResults) => {
      if (err) {
        console.error('Error fetching user info:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const userInfo = { ...userResults[0] };

      connection.query('SELECT address, city, postcode FROM address WHERE user_id = ?', [userId], (err, addressResults) => {
        if (err) {
          console.error('Error fetching address info:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        userInfo.address = addressResults.length > 0 ? addressResults[0].address : null;
        userInfo.city = addressResults.length > 0 ? addressResults[0].city : null;
        userInfo.postcode = addressResults.length > 0 ? addressResults[0].postcode : null;

        res.json({ success: true, data: userInfo });
      });
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};


// Update user info
export const updateUserInfo = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { first_name, last_name, email, phone, address, city, postcode } = req.body;
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token is missing' });
    }
  
    if (!first_name && !last_name && !email && !phone && !address && !city && !postcode) {
      return res.status(400).json({ success: false, message: 'At least one field must be provided to update' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded.user_id;
  
      const userUpdateResult = await queryDatabase(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE user_id = ?',
        [first_name || null, last_name || null, email || null, phone || null, userId]
      );
  
      if (userUpdateResult.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Check if the user has an existing address
      const addressResults = await queryDatabase(
        'SELECT * FROM address WHERE user_id = ?',
        [userId]
      );
  
      if (addressResults.length > 0) {
        // Update address info if it exists
        await queryDatabase(
          'UPDATE address SET address = ?, city = ?, postcode = ? WHERE user_id = ?',
          [address || null, city || null, postcode || null, userId]
        );
      } else {
        // Create a new address entry if it does not exist
        await queryDatabase(
          'INSERT INTO address (user_id, address, city, postcode) VALUES (?, ?, ?, ?)',
          [userId, address || null, city || null, postcode || null]
        );
      }
  
      // Fetch updated user info
      const updatedUserResults = await queryDatabase(
        'SELECT user_id, first_name, last_name, email, phone FROM users WHERE user_id = ?',
        [userId]
      );
  
      if (updatedUserResults.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const updatedUserInfo = { ...updatedUserResults[0] };
  
      // Fetch updated address info
      const updatedAddressResults = await queryDatabase(
        'SELECT address, city, postcode FROM address WHERE user_id = ?',
        [userId]
      );
  
      updatedUserInfo.address = updatedAddressResults.length > 0 ? updatedAddressResults[0].address : null;
      updatedUserInfo.city = updatedAddressResults.length > 0 ? updatedAddressResults[0].city : null;
      updatedUserInfo.postcode = updatedAddressResults.length > 0 ? updatedAddressResults[0].postcode : null;
  
      // Return updated user info as JSON
      res.json({ success: true, message: 'User info updated successfully', data: updatedUserInfo });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };

  // getCampaigninfo for view
  export const getCampaignInfo = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token is missing' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded.user_id;
  
      connection.query(
        'SELECT title, goal_amount, status, deadline FROM campaigns WHERE created_by = ?',
        [userId],
        (err, campaignResults) => {
          if (err) {
            console.error('Error fetching campaign info:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
          }
  
          connection.query(
            'SELECT first_name FROM users WHERE user_id = ?',
            [userId],
            (err, userResults) => {
              if (err) {
                console.error('Error fetching user name:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
              }
  
              const userName = userResults[0]?.first_name || 'User';
              const data = {
                campaigns: campaignResults,
                first_name: userName,
              };
  
              res.json({ success: true, data });
            }
          );
        }
      );
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };
  // allcampaign for card
  export const getAllCampaign = (req, res) => {
    // Fetch all campaigns along with the first name of the user who created each campaign
    const query = `
    SELECT 
      campaigns.campaign_id, 
      campaigns.title, 
      campaigns.description, 
      campaigns.short_description, 
      campaigns.goal_amount, 
      campaigns.raised_amount, 
      campaigns.status, 
      campaigns.deadline,
      campaigns.image, 
      users.first_name 
    FROM 
      campaigns
    JOIN 
      users 
    ON 
      campaigns.created_by = users.user_id
  `;
  
  
    connection.query(query, (err, campaignResults) => {
      if (err) {
        console.error('Error fetching campaign info:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
  
      const data = {
        campaigns: campaignResults,
      };
  
      res.json({ success: true, data });
    });
  };
  