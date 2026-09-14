import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';

const router = Router();
const controller = new UserController();

router.get('/me', authMiddleware, controller.getMe);

router.put('/me', authMiddleware, controller.updateMe);

router.get('/me/dashboard', authMiddleware, controller.getDashboard);

router.get('/:id', (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

export { router as userRouter };
