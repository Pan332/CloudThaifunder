import express from 'express';
import dotenv from 'dotenv';
const app = express();

app.use(express.json());
const port = process.env.PORT;


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error handling request:', err);
  res.status(500).send('Internal server error');
});

app.listen(port, () => {
  console.log(`Server is running on http://54.204.61.104:${port}`);
});