import connection from '../db.js';
import dotenv from 'dotenv';

dotenv.config({path:'../.env'});

// Add comment
export const addComment = (req, res) => {
  const { campaign_id, comment_text } = req.body;
  const user_id = req.user.user_id; 

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


export const editComment = (req, res) => {
  const { comment_text } = req.body;
  const { commentId } = req.params;
  const user_id = req.user.user_id;

  if (!comment_text) {
    return res.status(400).json({ success: false, message: 'Comment text is required' });
  }

  const checkOwnerQuery = 'SELECT * FROM comments WHERE comment_id = ? AND user_id = ?';
  connection.query(checkOwnerQuery, [commentId, user_id], (err, rows) => {
    if (err) {
      console.error('Error checking ownership:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this comment' });
    }

    const updateQuery = 'UPDATE comments SET comment_text = ? WHERE comment_id = ?';
    connection.query(updateQuery, [comment_text, commentId], (err, result) => {
      if (err) {
        console.error('Error updating comment:', err);
        return res.status(500).json({ success: false, message: 'Error updating comment' });
      }

      res.status(200).json({ success: true, message: 'Comment updated successfully' });
    });
  });
};

// Delete a comment by ID
export const deleteComment = (req, res) => {
  const { commentId } = req.params;
  const user_id = req.user.user_id;

  const checkOwnerQuery = 'SELECT * FROM comments WHERE comment_id = ? AND user_id = ?';
  connection.query(checkOwnerQuery, [commentId, user_id], (err, rows) => {
    if (err) {
      console.error('Error checking ownership:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this comment' });
    }

    const deleteQuery = 'DELETE FROM comments WHERE comment_id = ?';
    connection.query(deleteQuery, [commentId], (err, result) => {
      if (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).json({ success: false, message: 'Error deleting comment' });
      }

      res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    });
  });
};
// commentControllers.js
export const getComments = (req, res) => {
  const { commentId } = req.params;
  

  // Use a JOIN query to get comments along with the user's first name
  const query = `
    SELECT comments.comment_text, users.first_name, comments.created_at, comments.comment_id, comments.user_id
    FROM comments
    JOIN users ON comments.user_id = users.user_id
    WHERE comments.campaign_id = ?
  `;

  connection.query(query, [commentId], (error, results) => {
      if (error) {
          console.error('Error fetching comments:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      // Map the results to include only necessary fields
      const comments = results.map(comment => ({
          commentId: comment.comment_id,
          commentText: comment.comment_text,
          timestamp: comment.created_at,
          firstName: comment.first_name,
          userId: comment.user_id
      }));

      // Send the comments back as a response
      res.json({ success: true, comments });
  });
};


// Reply to a comment
export const replyComment = (req, res) => {
  const { campaign_id, comment_text, parent_comment_id } = req.body;
  const user_id = req.user.user_id;

  // Validation for required fields
  if (!campaign_id || !comment_text || !parent_comment_id) {
    return res.status(400).json({
      success: false,
      message: 'Campaign ID, comment text, and parent comment ID are required.',
    });
  }

  // Check if parent comment exists
  const checkParentQuery = `
    SELECT * FROM comments WHERE comment_id = ? AND campaign_id = ?
  `;
  connection.query(checkParentQuery, [parent_comment_id, campaign_id], (err, results) => {
    if (err) {
      console.error('Error verifying parent comment:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parent comment ID or campaign ID.',
      });
    }

    // Insert the reply
    const insertQuery = `
      INSERT INTO comments (campaign_id, user_id, comment_text, created_at, parent_id)
      VALUES (?, ?, ?, NOW(), ?)
    `;
    connection.query(
      insertQuery,
      [campaign_id, user_id, comment_text, parent_comment_id],
      (err, results) => {
        if (err) {
          console.error('Error adding reply:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        res.json({
          success: true,
          message: 'Reply added successfully',
          replyId: results.insertId,
        });
      }
    );
  });
};
