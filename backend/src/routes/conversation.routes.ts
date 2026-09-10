import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.get('/:id', authMiddleware, (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.post('/', authMiddleware, (_req, res) => {
  res.status(201).json({ message: 'Non implémenté' });
});

router.post('/:id/messages', authMiddleware, (_req, res) => {
  res.status(201).json({ message: 'Non implémenté' });
});

export { router as conversationRouter };
