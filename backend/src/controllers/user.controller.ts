import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { ApiError } from '../middlewares/error.middleware';

export class UserController {
  // ── Mon profil ──────────────────────────────────────────
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
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

  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = z
        .object({
          firstName: z.string().trim().min(2, 'Prénom trop court').max(50).optional(),
          lastName: z.string().trim().min(2, 'Nom trop court').max(50).optional(),
          phone: z.string().trim().max(20).optional().or(z.literal('')),
          city: z.string().trim().min(1).max(100).optional(),
          district: z.string().trim().max(100).optional().or(z.literal('')),
          businessName: z.string().trim().max(100).optional().or(z.literal('')),
          description: z.string().trim().max(2000).optional().or(z.literal('')),
        })
        .safeParse(req.body);

      if (!parsed.success) {
        throw new ApiError(
          400,
          'Données invalides',
          'VALIDATION_ERROR',
          parsed.error.issues.map((i) => ({
            field: i.path.join('.') || 'body',
            message: i.message,
          }))
        );
      }

      const data = parsed.data;
      const userId = req.user!.id;
      const emptyToUndefined = (v: string | undefined) => (v === undefined || v === '' ? undefined : v);

      const { city, district, businessName, description, ...userData } = data;
      const hasUserData = Object.values(userData).some((v) => v !== undefined);
      const hasProfileData =
        city !== undefined || district !== undefined || businessName !== undefined || description !== undefined;

      if (hasUserData) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            ...(userData.firstName !== undefined && { firstName: userData.firstName }),
            ...(userData.lastName !== undefined && { lastName: userData.lastName }),
            ...(userData.phone !== undefined && { phone: emptyToUndefined(userData.phone) ?? null }),
          },
        });
      }

      if (hasProfileData) {
        await prisma.sellerProfile.upsert({
          where: { userId },
          create: {
            userId,
            city: city ?? 'Antananarivo',
            district: emptyToUndefined(district),
            businessName: emptyToUndefined(businessName),
            description: emptyToUndefined(description),
          },
          update: {
            ...(city !== undefined && { city }),
            ...(district !== undefined && { district: emptyToUndefined(district) ?? null }),
            ...(businessName !== undefined && { businessName: emptyToUndefined(businessName) ?? null }),
            ...(description !== undefined && { description: emptyToUndefined(description) ?? null }),
          },
        });
      }

      const updated = await prisma.user.findUnique({
        where: { id: userId },
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

      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  // ── Dashboard vendeur : agrégats réels ──────────────────
  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sellerId = req.user!.id;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const [
        statusGroups,
        viewsAgg,
        favoritesReceived,
        conversationsCount,
        unreadMessages,
        soldAgg,
        soldThisMonth,
        soldLastMonth,
        topListings,
        recentLeads,
      ] = await Promise.all([
        prisma.listing.groupBy({
          by: ['status'],
          where: { sellerId },
          _count: { id: true },
        }),
        prisma.listing.aggregate({
          where: { sellerId },
          _sum: { viewsCount: true, price: true },
          _count: { id: true },
        }),
        prisma.favorite.count({
          where: { listing: { sellerId } },
        }),
        prisma.conversation.count({
          where: { sellerId },
        }),
        prisma.message.count({
          where: {
            conversation: { sellerId },
            senderId: { not: sellerId },
            isRead: false,
          },
        }),
        prisma.listing.aggregate({
          where: { sellerId, status: 'SOLD' },
          _count: { id: true },
          _sum: { price: true },
        }),
        prisma.listing.count({
          where: { sellerId, status: 'SOLD', updatedAt: { gte: startOfMonth } },
        }),
        prisma.listing.count({
          where: { sellerId, status: 'SOLD', updatedAt: { gte: startOfLastMonth, lt: startOfMonth } },
        }),
        prisma.listing.findMany({
          where: { sellerId, status: { in: ['ACTIVE', 'SOLD', 'PAUSED'] } },
          orderBy: { viewsCount: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
            viewsCount: true,
            images: { select: { url: true }, orderBy: { position: 'asc' }, take: 1 },
            _count: { select: { favorites: true, conversations: true } },
          },
        }),
        prisma.conversation.findMany({
          where: { sellerId },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            updatedAt: true,
            listing: { select: { id: true, title: true } },
            buyer: { select: { firstName: true } },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { content: true, createdAt: true, senderId: true, isRead: true },
            },
          },
        }),
      ]);

      const byStatus: Record<string, number> = {};
      for (const g of statusGroups) byStatus[g.status] = g._count.id;

      res.json({
        overview: {
          totalListings: viewsAgg._count.id,
          activeListings: byStatus.ACTIVE ?? 0,
          pausedListings: byStatus.PAUSED ?? 0,
          draftListings: byStatus.DRAFT ?? 0,
          soldListings: soldAgg._count.id,
          soldThisMonth,
          soldLastMonth,
          revenue: soldAgg._sum.price ?? 0,
          totalViews: viewsAgg._sum.viewsCount ?? 0,
          favoritesReceived,
          conversations: conversationsCount,
          unreadMessages,
        },
        topListings: topListings.map((l) => ({
          id: l.id,
          title: l.title,
          price: l.price,
          status: l.status,
          views: l.viewsCount,
          favorites: l._count.favorites,
          conversations: l._count.conversations,
          image: l.images[0]?.url ?? null,
        })),
        leads: recentLeads.map((c) => ({
          id: c.id,
          buyerName: c.buyer.firstName,
          listingId: c.listing.id,
          listingTitle: c.listing.title,
          lastMessage: c.messages[0]?.content ?? '',
          lastMessageAt: c.messages[0]?.createdAt ?? c.updatedAt,
          unread: !!c.messages[0] && !c.messages[0].isRead && c.messages[0].senderId !== sellerId,
        })),
      });
    } catch (error) {
      next(error);
    }
  };
}
