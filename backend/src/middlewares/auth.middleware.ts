import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/token';
import { ApiError } from './error.middleware';
import { prisma } from '../config/database';

// Étendre Request pour ajouter l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string };
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token manquant', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    req.user = {
      ...payload,
      id: payload.userId,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(401, 'Token invalide ou expiré', 'UNAUTHORIZED'));
  }
}

export function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new ApiError(403, 'Accès réservé aux administrateurs', 'FORBIDDEN'));
  }
  next();
}

// Middleware optionnel : identifie l'utilisateur si connecté mais ne bloque pas
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);
      req.user = { ...payload, id: payload.userId };
    }
  } catch {
    // Token invalide, on continue sans user
  }
  next();
}
