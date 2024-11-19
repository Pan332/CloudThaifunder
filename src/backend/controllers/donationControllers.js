import connection from '../db.js';

export const donationInsert = (req, res) => {
  const { amount, transaction_id } = req.body;
  const { campaign_id } = req.params;
  const user_id = req.user.user_id;

  // Fetch user email
  connection.execute(
    'SELECT email FROM users WHERE user_id = ?',
    [user_id],
    (err, userEmailResult) => {
      if (err) {
        console.error('Error fetching user email:', err);
        return res.status(500).json({ message: 'Database query failed' });
      }

      if (!userEmailResult || userEmailResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const email = userEmailResult[0]?.email;

      // Insert donation
      connection.execute(
        `INSERT INTO donations (campaign_id, user_id, amount, transaction_id, email)
         VALUES (?, ?, ?, ?, ?)`,
        [campaign_id, user_id, amount, transaction_id, email],
        (err, donationResult) => {
          if (err) {
            console.error('Error inserting donation:', err);
            return res.status(500).json({ message: 'Error inserting donation' });
          }

          // Respond with success message
          res.status(201).json({
            message: 'Donation recorded successfully',
            donation_id: donationResult.insertId,
          });
        }
      );
    }
  );
};