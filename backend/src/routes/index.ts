import { Router } from 'express';
import { authRouter } from './auth.routes';
import { motorcycleRouter } from './motorcycle.routes';
import { favoriteRouter } from './favorite.routes';
import { userRouter } from './user.routes';
import { conversationRouter } from './conversation.routes';
import { reviewRouter } from './review.routes';
import { reportRouter } from './report.routes';
import { adminRouter } from './admin.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/motorcycles', motorcycleRouter);
apiRouter.use('/favorites', favoriteRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/conversations', conversationRouter);
apiRouter.use('/sellers', reviewRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/admin', adminRouter);
