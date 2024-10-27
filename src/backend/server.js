import express from 'express'; // Use import instead of require
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checkconnection from './routes/check-connection.js';

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', checkconnection);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
