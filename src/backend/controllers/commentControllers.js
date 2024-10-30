import connection from '../db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({path:'../.env'});

// Add comment
export const Reviewcommentdata = async (req, res) => {
    const { accessToken, comment , title } = req.body;
    try {
      // Decode access token to extract username
      const decoded = jwt(accessToken);
      const username = decoded.name; 
       
      // Insert comment into the database along with the username and recipe title
      connection.query('INSERT INTO reviews (username, title, comment) VALUES (?, ?, ?)', [username, title, comment], (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ success: false, message: 'Error executing query' });
        }
        // Check if comment was successfully inserted
        res.status(201).json({ success: true, message: 'Comment registered successfully' });
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

// Delete a comment by ID
export const deleteComment = async (req, res) => {
  const commentId = decodeURIComponent(req.query.comment); // Get commentId from URL route parameter
  try {
    // Check if the comment exists
    const commentExistsQuery = 'SELECT * FROM reviews WHERE id = ?';
    connection.query(commentExistsQuery, [commentId], (err, rows) => {
      if (err) {
        console.error('Error checking if comment exists:', err);
        return res.status(500).json({ success: false, message: 'Error checking if comment exists' });
      }
      // If comment does not exist, return an error response
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      // Delete the comment
      const deleteCommentQuery = 'DELETE FROM reviews WHERE id = ?';
      connection.query(deleteCommentQuery, [commentId], (err, result) => {
        if (err) {
          console.error('Error deleting comment:', err);
          return res.status(500).json({ success: false, message: 'Error deleting comment' });
        }
        // Check if the comment was successfully deleted
        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        // Comment deleted successfully
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


  export const DisplayAllComment = (req, res) => {
    const { title } = req.body; // Extract title from req.body
    connection.query('SELECT * FROM reviews WHERE title = ?', [title], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            return res.status(500).json({ success: false, message: 'Error fetching comments' });
        }
        return res.json({ success: true, comments: results });
    });
};

export const getComments = (req, res) => {
  const { title } = req.body;

  // Use a JOIN query to get comments along with the username
  const query = `
    SELECT reviews.*, users.username, created_at , id
    FROM reviews
    JOIN users ON reviews.username = users.username
    WHERE reviews.title = ?
`;

  connection.query(query, [title], (error, results) => {
      if (error) {
          console.error('Error fetching comments:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      // Map the results to include only necessary fields
      const comments = results.map(comment => ({
          commentId: comment.id,
          comment: comment.comment,
          timestamp: comment.created_at,
          username: comment.username
      }));

      // Send the comments back as a response
      res.json({ success: true, comments });
  });
};