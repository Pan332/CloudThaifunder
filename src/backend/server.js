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
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import getEnv from './routes/getenv.js'


dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT;
const accesstoken = process.env.ACCESS_TOKEN_SECRET;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));
  
  app.use(helmet());

  app.use(express.urlencoded({limit: '5mb',  extended: true }));
  app.use(express.json());
  
  
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 60,                   
    message: 'Too many login attempts, please try again later.'
  });
  
  app.use(cookieParser());
  
  const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Strict',
  };
  
  // Set security-related cookies
  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', 'token', cookieOptions); // Example of setting secure cookie
    next();
  });
  
  app.options('*', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
      res.setHeader('Access-Control-Allow-Credentials', 'true'); 
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 
      res.sendStatus(204); // No content
    });  
  
  app.use('/uploads', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    });


// Routes
app.use('/auth',loginLimiter, authRoutes);
app.use('/', checkconnection);
app.use('/campaign', campaignRoutes);
app.use('/view',userView);
app.use('/badge',badgeRoutes);
app.use('/admin', adminRoutes);
app.use('/api', router);
app.use('/comment', commentRoutes);
app.use('/badge',verifyAdmin,badgeRoutes);
app.use('/promptpay', transactionRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/getenv',getEnv)



  
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, 'https://' + req.headers.host + req.url);
      }
      next();
    });
  }
  
  // HSTS - HTTP Strict Transport Security
  app.use(helmet.hsts({
    maxAge: 31536000,         // 1 year
    includeSubDomains: true,  // Apply to all subdomains
    preload: true,            // Preload this policy in browsers
  }));
  
  // Content Security Policy (CSP)
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "http://localhost:4321", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  }));
  
  // X-Content-Type-Options (Prevent MIME type sniffing)
  app.use(helmet.noSniff());
  
  // XSS Protection (Cross-Site Scripting)
  app.use(helmet.xssFilter());
  
  // Referrer Policy
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
  
  
  app.use((req, res, next) => {
      res.setHeader('Permissions-Policy', 'geolocation=(self), fullscreen=(self)');
      next();
    });
    
    // Example of setting a secure cookie for access token
    app.use((req, res, next) => {
      res.cookie('access_token', accesstoken, cookieOptions);
      next();
    })
export default  app;