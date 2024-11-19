import QRCode from 'qrcode';
import generatePayload from 'promptpay-qr';
import _ from 'lodash';
import connection from '../db.js';

export const promptpay = (req, res) => {
  try {
    // Get the amount and campaign ID from the request body
    const amount = parseFloat(_.get(req, ["body", "amount"]));
    const campaign_id = req.body.id?.trim();

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({
        RespCode: 400,
        RespMessage: 'Invalid amount provided.'
      });
    }

    // Validate the campaign_id
    if (!campaign_id || isNaN(campaign_id)) {
      console.log('Invalid or missing campaign_id');
      return res.status(400).json({
        RespCode: 400,
        RespMessage: 'Invalid or missing campaign ID.'
      });
    }

    // Prepared statement to avoid SQL injection
    const query = 'SELECT phone_number FROM campaigns WHERE campaign_id = ?';
    connection.execute(query, [campaign_id], (err, results) => {
      if (err) {
        console.error('Database query failed:', err);
        return res.status(500).json({ RespCode: 500, RespMessage: 'Database error.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ RespCode: 404, RespMessage: 'Campaign not found' });
      }

      const phoneNumber = results[0].phone_number;

      const payload = generatePayload(phoneNumber, { amount });
      const options = {
        color: {
          dark: '#000',
          light: '#fff'
        }
      };

      console.log('Generating QR code...');
      QRCode.toDataURL(payload, options, (err, url) => {
        if (err) {
          console.error('QR Code generation failed:', err);
          return res.status(400).json({
            RespCode: 400,
            RespMessage: 'QR code generation failed: ' + err.message
          });
        }

        console.log('QR code generated successfully');
        return res.status(200).json({
          RespCode: 200,
          RespMessage: 'QR code generated successfully.',
          Result: url
        });
      });
    });
  } catch (error) {
    console.error('Error in generating PromptPay QR:', error);
    return res.status(500).json({
      RespCode: 500,
      RespMessage: 'Internal server error'
    });
  }
};