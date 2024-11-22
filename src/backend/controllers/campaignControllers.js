// controllers/campaignControllers.js
import connection from '../db.js';

// Create Campaign
export const createCampaign = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const { title, description, goal_amount, shortDescription, endDate, category, phone_number  } = req.body;
  const created_by = req.user.user_id;
  const imagePath = req.body.imagePath;

  // Validate required fields
  if (!title || !description || goal_amount === undefined || !shortDescription || !endDate || !imagePath || !category || !phone_number) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Check if the category exists in campaigncategories table
  const checkCategoryQuery = `SELECT category_id FROM campaigncategories WHERE category_name = ?`;
  connection.query(checkCategoryQuery, [category], (err, categoryResults) => {
    if (err) {
      console.error('Error checking category:', err);
      return res.status(500).json({ success: false, message: 'Error checking category', error: err.message });
    }

    if (categoryResults.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const category_id = categoryResults[0].category_id;

    // Insert campaign into the database
    const insertCampaignQuery = `
      INSERT INTO campaigns (title, description, goal_amount, created_by, status, short_description, deadline, image, phone_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(
      insertCampaignQuery,
      [title, description, goal_amount, created_by, 'pending', shortDescription, endDate, imagePath, phone_number],
      (err, results) => {
        if (err) {
          console.error('Error executing insert query:', err);
          return res.status(500).json({ success: false, message: 'Error executing query', error: err.message });
        }

        const campaign_id = results.insertId;

        // Insert category into campaigncategorymapping table
        const insertCategoryMappingQuery = `
          INSERT INTO campaigncategorymapping (campaign_id, category_id) VALUES (?, ?)
        `;
        connection.query(insertCategoryMappingQuery, [campaign_id, category_id], (err) => {
          if (err) {
            console.error('Error inserting category mapping:', err);
            return res.status(500).json({ success: false, message: 'Error inserting category mapping', error: err.message });
          }

          res.status(201).json({
            success: true,
            message: 'Campaign created successfully',
            campaign_id: campaign_id
          });
        });
      }
    );
  });
};

// Edit Campaign (Specific Fields)
export const editCampaign = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  const id = parseInt(req.params.id, 10);
if (isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Invalid campaign ID' });
}

  const { title, shortDescription, description, phone_number } = req.body; // Get fields from request body

  console.log('Request body:', req.body);
  console.log('Request params:', req.params);
  
  
  // Validate required fields
  if (!title && !shortDescription && !description && !phone_number) {
    return res.status(400).json({ success: false, message: 'At least one field is required for update' });
  }

  const query = `
    UPDATE Campaigns 
    SET title = ?, short_description = ?, description = ?, phone_number = ?
    WHERE campaign_id = ?
  `;

  connection.query(query, [title, shortDescription, description, phone_number, id], (err, results) => {
    if (err) {
      console.error('Error updating campaign:', err);
      return res.status(500).json({ success: false, message: 'Error updating campaign', error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.status(200).json({ success: true, message: 'Campaign updated successfully' });
  });
};

// Read All Campaigns
export const getCampaigns = (req, res) => {
  const query = 'SELECT * FROM Campaigns WHERE status = "pending"';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching campaigns:', err);
      return res.status(500).json({ success: false, message: 'Error fetching campaigns' });
    }
    res.status(200).json({ success: true, campaigns: results });
  });
};


// Delete Campaign
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

