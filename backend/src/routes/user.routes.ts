import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.put('/me', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.get('/:id', (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

export { router as userRouter };
