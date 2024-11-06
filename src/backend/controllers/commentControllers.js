import connection from '../db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({path:'../.env'});

// Add comment
export const addComment = (req, res) => {
  const { campaign_id, comment_text } = req.body;
  const user_id = req.user.user_id; // User ID from the token

  if (!campaign_id || !comment_text) {
    return res.status(400).json({ success: false, message: 'Campaign ID and comment text are required' });
  }
  const query = `
      INSERT INTO comments (campaign_id, user_id, comment_text, created_at) 
      VALUES (?, ?, ?, NOW())`;

  connection.query(query, [campaign_id, user_id, comment_text], (err, results) => {
      if (err) {
          console.error('Error adding comment:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      res.json({ success: true, message: 'Comment added successfully' });
  });
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

// commentControllers.js
export const getComments = (req, res) => {
  const { campaign_id } = req.params;

  // Use a JOIN query to get comments along with the user's first name
  const query = `
    SELECT comments.comment_text, users.first_name, comments.created_at, comments.comment_id
    FROM comments
    JOIN users ON comments.user_id = users.user_id
    WHERE comments.campaign_id = ?
  `;

  connection.query(query, [campaign_id], (error, results) => {
      if (error) {
          console.error('Error fetching comments:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      // Map the results to include only necessary fields
      const comments = results.map(comment => ({
          commentId: comment.id,
          commentText: comment.comment_text,
          timestamp: comment.created_at,
          firstName: comment.first_name
      }));

      // Send the comments back as a response
      res.json({ success: true, comments });
  });
};
