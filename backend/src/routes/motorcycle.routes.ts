import { Router } from 'express';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

// TODO: implémenter motorcycle controller
router.get('/', optionalAuth, (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.get('/:id', optionalAuth, (_req, res) => {
  res.status(404).json({ message: 'Non implémenté' });
});

router.post('/', authMiddleware, (_req, res) => {
  res.status(201).json({ message: 'Non implémenté' });
});

router.put('/:id', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.delete('/:id', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.patch('/:id/status', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.post('/:id/images', authMiddleware, (_req, res) => {
  res.status(201).json({ message: 'Non implémenté' });
});

router.delete('/:id/images/:imageId', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

export { router as motorcycleRouter };
