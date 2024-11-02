import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checkconnection from './routes/check-connection.js';
import campaignRoutes from './routes/campaign.js';
<<<<<<< HEAD
=======
import userView from './routes/view.js';
import badgeRoutes from './routes/badge.js';
>>>>>>> 6d9184a65caaaa431edcf6efd8a9567c59aa4a50

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));
  
  
  app.use(express.urlencoded({limit: '10mb',  extended: true }));
  app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', checkconnection);
app.use('/campaign', campaignRoutes);
<<<<<<< HEAD
=======
app.use('/view',userView);
app.use('/badge',badgeRoutes);
>>>>>>> 6d9184a65caaaa431edcf6efd8a9567c59aa4a50


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});