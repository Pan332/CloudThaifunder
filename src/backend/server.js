import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checkconnection from './routes/check-connection.js';
import campaignRoutes from './routes/campaign.js';
import commentRoutes from './routes/comment.js';
import userView from './routes/view.js';
import badgeRoutes from './routes/badge.js';
import adminRoutes from './routes/admin.js';

import router from './routes/view.js';
import transactionRoutes from './routes/transaction.js'
import { isAuthenticated } from './middleware/backend/isAuth.js';
import { verifyAdmin } from './middleware/backend/isAdmin.js';

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));
  

  app.use(express.urlencoded({limit: '50mb',  extended: true }));
  app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', checkconnection);
app.use('/campaign', campaignRoutes);
app.use('/view',userView);
app.use('/badge',badgeRoutes);
app.use('/admin',adminRoutes);

app.use('/api', router);
app.use('/comment', commentRoutes);
app.use('/badge',verifyAdmin,badgeRoutes);
app.use('/api/paypal',isAuthenticated, transactionRoutes);
app.use('/uploads', express.static('uploads'));


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});