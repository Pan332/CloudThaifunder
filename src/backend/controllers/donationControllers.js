import connection from '../db.js';

export const donationInsert = (req, res) => {
  const { amount, transaction_id } = req.body;
  const { campaign_id } = req.params;
  const user_id = req.user.user_id;

  // Get a single connection from the pool
  connection.getConnection((err, conn) => {
    if (err) {
      console.error('Error getting database connection:', err);
      return res.status(500).json({ message: 'Database connection failed' });
    }

    conn.beginTransaction((transactionError) => {
      if (transactionError) {
        console.error('Error starting transaction:', transactionError);
        conn.release(); // Release the connection back to the pool
        return res.status(500).json({ message: 'Transaction initiation failed' });
      }

      // Fetch user email
      conn.execute(
        'SELECT email FROM users WHERE user_id = ?',
        [user_id],
        (err, userEmailResult) => {
          if (err) {
            console.error('Error fetching user email:', err);
            conn.rollback(() => conn.release());
            return res.status(500).json({ message: 'Database query failed' });
          }

          if (!userEmailResult || userEmailResult.length === 0) {
            conn.rollback(() => conn.release());
            return res.status(404).json({ message: 'User not found' });
          }

          const email = userEmailResult[0]?.email;

          // Insert donation
          conn.execute(
            `INSERT INTO donations (campaign_id, user_id, amount, transaction_id, email)
             VALUES (?, ?, ?, ?, ?)`,
            [campaign_id, user_id, amount, transaction_id, email],
            (err, donationResult) => {
              if (err) {
                console.error('Error inserting donation:', err);
                conn.rollback(() => conn.release());
                return res.status(500).json({ message: 'Error inserting donation' });
              }

              // Update raised_amount in campaigns table
              conn.execute(
                `UPDATE campaigns
                 SET raised_amount = raised_amount + ?
                 WHERE campaign_id = ?`,
                [amount, campaign_id],
                (updateError) => {
                  if (updateError) {
                    console.error('Error updating raised amount:', updateError);
                    conn.rollback(() => conn.release());
                    return res.status(500).json({ message: 'Error updating raised amount' });
                  }

                  // Commit transaction
                  conn.commit((commitError) => {
                    if (commitError) {
                      console.error('Error committing transaction:', commitError);
                      conn.rollback(() => conn.release());
                      return res.status(500).json({ message: 'Transaction commit failed' });
                    }

                    // Release the connection and respond with success
                    conn.release();
                    res.status(201).json({
                      message: 'Donation recorded successfully',
                      donation_id: donationResult.insertId,
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};
