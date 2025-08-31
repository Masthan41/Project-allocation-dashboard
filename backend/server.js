import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
dotenv.config();

const app = express();
const httpServer = createServer(app);

// app.use(cors({
//   origin: [
//     "http://localhost:5173", 
//     "http://localhost:3000",
//     "https://projectallocations.netlify.app",   // ✅ actual frontend domain
//     "https://projectallocations.netlify.app" // (keep if you have both)
//   ],
//   credentials: true
// }));


const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://projectallocations.netlify.app/"
    ],
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173", // dev
    "http://localhost:3000", // dev (React default)
    "https://projectallocations.netlify.app/" // ✅ production
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO for real-time notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available globally
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});