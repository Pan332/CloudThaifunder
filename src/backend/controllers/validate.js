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
  console.log(`Server is running on http://23.22.78.84:${port}`);
});