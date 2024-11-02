import jwt from 'jsonwebtoken';
import connection from '../db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

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

// Function to add a badge - Admin only
export const addBadge = async (req, res) => {
  const { name, description, requirements } = req.body;

  if (!name || !description || !requirements) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const result = await queryDatabase(
      'INSERT INTO badges (badge_name, description, requirements) VALUES (?, ?, ?)',
      [name, description, requirements]
    );
    res.json({ success: true, message: 'Badge added successfully', badgeId: result.insertId });
  } catch (error) {
    console.error('Error adding badge:', error);
    res.status(500).json({ success: false, message: 'Failed to add badge' });
  }
};

// Function to delete a badge - Admin only
export const deleteBadge = async (req, res) => {
  const { badgeId } = req.params;

  try {
    const result = await queryDatabase('DELETE FROM badges WHERE badge_id = ?', [badgeId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }
    res.json({ success: true, message: 'Badge deleted successfully' });
  } catch (error) {
    console.error('Error deleting badge:', error);
    res.status(500).json({ success: false, message: 'Failed to delete badge' });
  }
};

// Function to update a badge - Admin only
export const updateBadge = async (req, res) => {
  const { badgeId } = req.params;
  const { name, description, requirements } = req.body;

  try {
    const result = await queryDatabase(
      'UPDATE badges SET badge_name = ?, description = ?, requirements = ? WHERE badge_id = ?',
      [name, description, requirements, badgeId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }
    res.json({ success: true, message: 'Badge updated successfully' });
  } catch (error) {
    console.error('Error updating badge:', error);
    res.status(500).json({ success: false, message: 'Failed to update badge' });
  }
};

export const fetchBadges = async (req, res) => {
    try {
      const results = await queryDatabase('SELECT * FROM badges'); // Adjust the SQL query as needed
      res.json(results); // Send the results as JSON
    } catch (error) {
      console.error('Error fetching badges:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch badges' });
    }
  };