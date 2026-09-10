import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { ApiError } from '../middlewares/error.middleware';

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, phone, password } = req.body;

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ApiError(409, 'Cet email est déjà utilisé', 'EMAIL_TAKEN');
      }

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(password, 12);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          passwordHash,
        },
      });

      // Créer le profil vendeur par défaut
      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          city: 'Antananarivo',
        },
      });

      // Générer les tokens
      const tokens = generateTokens(user.id, user.role);

      // Stocker le refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      res.status(201).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        ...tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new ApiError(401, 'Email ou mot de passe incorrect', 'INVALID_CREDENTIALS');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Email ou mot de passe incorrect', 'INVALID_CREDENTIALS');
      }

      // Générer les tokens
      const tokens = generateTokens(user.id, user.role);

      // Stocker le refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified,
          isVerifiedSeller: user.isVerifiedSeller,
          createdAt: user.createdAt,
        },
        ...tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ApiError(400, 'Refresh token manquant', 'MISSING_TOKEN');
      }

      // Vérifier le token
      const payload = verifyRefreshToken(refreshToken);

      // Vérifier en BDD
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new ApiError(401, 'Refresh token invalide ou expiré', 'INVALID_TOKEN');
      }

      // Supprimer l'ancien refresh token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });

      // Générer de nouveaux tokens
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        throw new ApiError(401, 'Utilisateur non trouvé', 'USER_NOT_FOUND');
      }

      const tokens = generateTokens(user.id, user.role);

      // Stocker le nouveau refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      res.json(tokens);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Supprimer le refresh token
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const { userId } = req.user!;
        await prisma.refreshToken.deleteMany({ where: { userId } });
      }
      res.json({ message: 'Déconnecté' });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          isPhoneVerified: true,
          isEmailVerified: true,
          isVerifiedSeller: true,
          verificationStatus: true,
          createdAt: true,
          sellerProfile: true,
        },
      });

      if (!user) {
        throw new ApiError(404, 'Utilisateur non trouvé', 'USER_NOT_FOUND');
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
