// server/routes/reviewRoutes.js

import express from 'express';
import {
  leaveReview,
  getReviewsByTarget,
  deleteReview
} from '../controllers/reviewController.js';
import { authorize } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// 🔐 Authenticated user leaves a review
router.post('/', authorize, leaveReview);

// 🌍 Public or logged-in fetch reviews by target
// Example: /api/reviews/listing/648a... OR /api/reviews/landlord/648b...
router.get('/:targetType/:targetId', getReviewsByTarget);

// 🔒 Admin deletes a review
router.delete('/:id', authorize, roleCheck(['admin', 'superadmin']), deleteReview);

export default router;
