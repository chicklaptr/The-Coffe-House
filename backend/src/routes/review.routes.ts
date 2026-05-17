import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Phải đăng nhập mới được viết đánh giá (Role nào cũng được, thường là Role 1)
router.post('/', authenticateToken, reviewController.createReviewHandler);

export default router;
