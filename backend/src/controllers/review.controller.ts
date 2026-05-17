import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';

export const createReviewHandler = async (req: Request, res: Response) => {
    try {
        const { cafe_id, rating, comment, image_urls } = req.body;
        
        // Auth check is handled by middleware, so req.user exists
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!cafe_id || rating === undefined) {
            return res.status(400).json({ error: 'Missing required fields: cafe_id or rating' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const result = await reviewService.createReview({
            cafe_id,
            user_id,
            rating,
            comment,
            image_urls
        });

        res.status(201).json({
            message: 'Review submitted successfully',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
