import express from 'express';
import { adminLogin, getAllUsers, getAllProjects } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin login
router.post('/login', adminLogin);

// Protected routes
router.get('/users', verifyAdmin, getAllUsers);
router.get('/projects', verifyAdmin, getAllProjects);

export default router;
