import client from '../middleware/paypal.js';
import paypal from '@paypal/checkout-server-sdk';
import connection from '../db.js';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Validation schema
const donationSchema = Joi.object({
  campaign_id: Joi.number().required(),
  payment_method: Joi.string().valid('credit_card', 'bank_transfer', 'paypal').required(),
  amount: Joi.number().positive().required(),
  campaignOwnerPayPal: Joi.string().email().required()
});

export const createDonationAndPayout = async (req, res) => {
  const { amount, campaignOwnerPayPal, campaign_id, user_id } = req.body;
  const { error } = donationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const transactionId = uuidv4();

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Create donation entry
    const donation = await connection.donations.create({
      campaign_id,
      user_id,
      amount,
      donation_status: 'created',
      transaction_id: transactionId
    });

    const payoutRequest = new paypal.payouts.PayoutsPostRequest();
    payoutRequest.requestBody({
      sender_batch_header: {
        email_subject: 'You have received a donation!',
        sender_batch_id: transactionId
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: { value: amount, currency: 'THB' },
          receiver: campaignOwnerPayPal,
          note: `Donation received for your campaign`
        }
      ]
    });

    // Execute PayPal Payouts request
    const payoutResponse = await client.execute(payoutRequest);
    const payoutBatchId = payoutResponse.result.batch_header.payout_batch_id;

    // Save payment details
    await connection.payment.create({
      donation_id: donation.donation_id,
      payment_method: 'paypal',
      payment_status: 'pending',
      transaction_id: payoutBatchId
    });

    // Commit transaction if successful
    await connection.commit();
    res.json({ status: 'success', batch_id: payoutBatchId, donation_id: donation.donation_id });
    
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Failed transaction:', error);
    
    res.status(500).json({
      error: 'Transaction failed',
      details: error.response ? error.response.message : error.message,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { batch_id } = req.body;

  if (!batch_id) {
    return res.status(400).json({ error: 'Batch ID is required to update payment status' });
  }

  const payoutStatusRequest = new paypal.payouts.PayoutsGetRequest(batch_id);

  try {
    // Begin transaction
    await connection.beginTransaction();

    const payoutDetails = await client.execute(payoutStatusRequest);
    const batchStatus = payoutDetails.result.batch_header.batch_status;

    const SUCCESS = 'SUCCESS';
    const FAILED = 'FAILED';
    const COMPLETED = 'completed';
    
    if (batchStatus === SUCCESS) {
      await connection.payment.update(
        { payment_status: COMPLETED },
        { where: { transaction_id: batch_id } }
      );

      await connection.donations.update(
        { donation_status: COMPLETED },
        { where: { transaction_id: batch_id } }
      );
    } else if (batchStatus === FAILED) {
      await connection.payment.update(
        { payment_status: FAILED },
        { where: { transaction_id: batch_id } }
      );

      await connection.donations.update(
        { donation_status: FAILED },
        { where: { transaction_id: batch_id } }
      );
    } else {
      res.json({ status: batchStatus.toLowerCase(), details: payoutDetails.result });
      return; // Exit to avoid committing transaction
    }

    // Commit transaction
    await connection.commit();
    res.json({ status: batchStatus.toLowerCase(), details: payoutDetails.result });

  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Failed to update payment status:', error);

    res.status(500).json({
      error: 'Failed to update payment status',
      details: error.response ? error.response.message : error.message,
    });
  }
};