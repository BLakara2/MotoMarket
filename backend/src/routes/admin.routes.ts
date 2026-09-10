import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les routes admin nécessitent auth + role ADMIN
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.get('/users', (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.get('/listings', (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.get('/reports', (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.get('/brands', (_req, res) => {
  res.json({ data: [] });
});

router.get('/models', (_req, res) => {
  res.json({ data: [] });
});

export { router as adminRouter };
