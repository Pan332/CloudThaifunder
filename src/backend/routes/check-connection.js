import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get('/check-connection', (req, res) => {
    console.log('Check connection endpoint hit'); // Log when the endpoint is accessed
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Error executing query' });
      return;
    }
    res.status(200).json({ success: true, message: 'Database connection is active' });
  });
});

export default router;
