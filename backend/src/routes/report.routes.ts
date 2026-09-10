import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, (_req, res) => {
  res.status(201).json({ message: 'Non implémenté' });
});

export { router as reportRouter };
