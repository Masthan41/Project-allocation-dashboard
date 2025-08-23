import express from 'express';
import {
  createApplication,
  getMyApplications,
  getAllApplications,
  reviewApplication
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createApplication);
router.get('/my', authenticate, getMyApplications);
router.get('/all', authenticate, authorize('admin'), getAllApplications);
router.put('/:id/review', authenticate, authorize('admin'), reviewApplication);

export default router;