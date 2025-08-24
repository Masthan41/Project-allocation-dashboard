// adminRoutes.js
import express from 'express';
import { login as adminLogin } from '../controllers/userController.js'; // <-- use login from userController
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { getAllUsers, getAllProjects } from '../controllers/adminController.js'; // make sure these exist

const router = express.Router();

// Admin login
router.post('/login', adminLogin);

// Protected routes
router.get('/users', verifyAdmin, getAllUsers);
router.get('/projects', verifyAdmin, getAllProjects);

export default router;
