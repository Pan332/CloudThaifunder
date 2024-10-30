import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checkconnection from './routes/check-connection.js';
import campaignRoutes from './routes/campaign.js';

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));
  
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', checkconnection);
app.use('/campaign', campaignRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
