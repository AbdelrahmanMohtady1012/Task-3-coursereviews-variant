import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllReviews,
  getReview,
  getCourseSummary,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = Router();

// Reading is public; writing requires a logged-in user.
// '/summary' must come before '/:id' or Express will try to match
// "summary" as an :id param and findById will throw a CastError.
router.get('/summary', getCourseSummary);
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', requireAuth, createReview);
router.patch('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;
