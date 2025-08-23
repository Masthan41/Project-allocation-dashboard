import express from 'express';
import {
  getBatches,
  getBatch,
  updateBatchProgress,
  getMyBatch
} from '../controllers/batchController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), getBatches);
router.get('/my', authenticate, getMyBatch);
router.get('/:id', authenticate, getBatch);
router.put('/:id/progress', authenticate, authorize('admin'), updateBatchProgress);

export default router;