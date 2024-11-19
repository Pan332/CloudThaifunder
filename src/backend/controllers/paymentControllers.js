import connection from '../db.js';

export const insertPayment = (req, res) => {
  const { donation_id, payment_method , transaction_id } = req.body;

  // Insert payment into the database
  connection.execute(
    `INSERT INTO payments (donation_id, payment_method, transaction_id)
     VALUES (?, ?, ?)`,
    [donation_id, payment_method, transaction_id],
    (err, result) => {
      if (err) {
        console.error('Error inserting payment:', err);
        return res.status(500).json({ message: 'Error inserting payment', error: err.message });
      }

      // Respond with success
      res.status(201).json({
        message: 'Payment recorded successfully',
        payment_id: result.insertId, // Return the ID of the inserted payment
      });
    }
  );
};