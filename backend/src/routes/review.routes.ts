import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:sellerId/reviews', (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.post('/:sellerId/reviews', authMiddleware, (_req, res) => {
  res.status(201).json({ message: 'Non implémenté' });
});

export { router as reviewRouter };
