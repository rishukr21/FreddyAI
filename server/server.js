import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'FreddyAI — Personal Placement Tracker API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Auth & API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 [FreddyAI Server] Running on http://localhost:${PORT}`);
  });
};

startServer();
