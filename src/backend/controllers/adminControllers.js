import connection from '../db.js';
import jwt from 'jsonwebtoken';

export const getAlluser = (req, res) => {
  // SQL query to select users (excluding admin) and their addresses
  const query = 
   `SELECT 
    u.user_id, 
    u.username, 
    u.email, 
    u.role, 
    u.phone, 
    u.first_name, 
    u.last_name,
    a.address,
    a.city,
    a.postcode,
    COUNT(c.campaign_id) AS total_campaigns, 
    COALESCE(SUM(c.raised_amount), 0) AS total_earnings,  

    COALESCE(SUM(c.status = 'pending'), 0) AS pending_campaigns,
    COALESCE(SUM(c.status = 'verified'), 0) AS verified_campaigns,
    COALESCE(SUM(c.status = 'completed'), 0) AS completed_campaigns

    FROM users u
    LEFT JOIN address a ON u.user_id = a.user_id
    LEFT JOIN campaigns c ON u.user_id = c.created_by  
    WHERE u.role != 'admin'
    GROUP BY u.user_id
    ORDER BY u.first_name;`;

  connection.query(query, (err, userResults) => {
      if (err) {
          console.error('Error fetching users:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      // Return the user data
      res.json({ success: true, data: { userResults } });
  });
};



// Edit user information

  export const editUserInfo = (req, res) => {
    const { id } = req.params; // Get user ID from route parameters
    const { username, email, role, phone, first_name, last_name } = req.body; // Updated user info from request body
  
    // SQL query to update the user info
    const query = `
      UPDATE users 
      SET username = ?, email = ?, role = ?, phone = ?, first_name = ?, last_name = ? 
      WHERE user_id = ?`;
  
    connection.query(query, [username, email, role, phone, first_name, last_name, id], (err, result) => {
      if (err) {
        console.error('Error updating user info:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      res.json({ success: true, message: 'User info updated successfully' });
    });
  };

  // Delete user
export const deleteUser = (req, res) => {
    const { id } = req.params; // Get user ID from route parameters
  
    // SQL query to delete the user
    const query = `
      DELETE FROM users WHERE user_id = ?`;
  
    connection.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      res.json({ success: true, message: 'User deleted successfully' });
    });
  };

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
    users.first_name,
    campaigncategories.category_name AS campaign_tag
FROM 
    campaigns
JOIN 
    users 
ON 
    campaigns.created_by = users.user_id
LEFT JOIN 
    campaigncategorymapping 
ON 
    campaigns.campaign_id = campaigncategorymapping.campaign_id
LEFT JOIN 
    campaigncategories 
ON 
    campaigncategorymapping.category_id = campaigncategories.category_id;


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
 
  export const hideCampaigns = (req, res) => {
    const { id } = req.params; // Get user ID from route parameters
    const {status} = req.body;
    // SQL query to update the user info
    const query = `
      UPDATE campaigns
      SET status = ?
      WHERE campaign_id = ?`;
  
    connection.query(query, [status, id], (err, result) => {
      if (err) {
        console.error('Error hiding Campaign :', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      res.json({ success: true, message: 'hiding Campaign successfully' });
    });
  };

  export const deleteCampaign = (req, res) => {
    const { campaign_id } = req.body;
  
    // Validate required fields
    if (!campaign_id) {
      return res.status(400).json({ success: false, message: 'Missing campaign ID' });
    }
  
    const query = 'UPDATE Campaigns SET status = "deleted" WHERE campaign_id = ?'; // Soft delete
    connection.query(query, [campaign_id], (err, results) => {
      if (err) {
        console.error('Error deleting campaign:', err);
        return res.status(500).json({ success: false, message: 'Error deleting campaign' });
      }
      res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
    });
  };
export const PendingCampaigns = (req, res) => {
    // Fetch all campaigns along with the first name of the user who created each campaign
    const query = `
 SELECT * FROM campaigns WHERE status = 'pending'
 `;
  
  
    connection.query(query, (err, pendingCampaigns) => {
      if (err) {
        console.error('Error fetching campaign info:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
  
      const data = {
        campaigns: pendingCampaigns,
      };
  
      res.json({ success: true, data });
    });
  };

  export const ValidateCampaigns = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.user_id;
    const userRole = decoded.role;
    console.log(userRole)
    // Check if the user has the required role to validate campaigns
    if (userRole !== 'admin' && userRole !== 'validator') {
      return res.status(403).json({ success: false, message: 'Unauthorized: Only admins and validators can verify campaigns' });
    }
  
    const { campaign_id } = req.body;
  
    // Update campaign status to 'verified' if it is currently 'pending'
    const updateCampaignQuery = `
      UPDATE campaigns 
      SET status = 'verified' 
      WHERE campaign_id = ? AND status = 'pending'
    `;
  
    connection.query(updateCampaignQuery, [campaign_id], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating campaign status:', updateErr);
        return res.status(500).json({ success: false, message: 'Failed to update campaign status' });
      }
  
      // Check if any rows were updated (i.e., campaign was pending)
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Campaign not found or already verified' });
      }
  
      // Insert verification record if campaign status was successfully updated
      const insertVerificationQuery = `
        INSERT INTO verifications (campaign_id, verifier_id, status, verified_at)
        VALUES (?, ?, 'verified', NOW())
      `;
      connection.query(insertVerificationQuery, [campaign_id, userId], (insertErr) => {
        if (insertErr) {
          console.error('Error inserting verification record:', insertErr);
          return res.status(500).json({ success: false, message: 'Failed to record verification' });
        }
  
        res.json({ success: true, message: 'Campaign verified successfully' });
      });
    });
  };