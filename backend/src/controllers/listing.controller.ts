import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { ApiError } from '../middlewares/error.middleware';
import { ALLOWED_MIME } from '../middlewares/upload.middleware';
import { requireStorage, putObject, deleteObject, getObjectStream } from '../services/s3';

const LISTINGS_INCLUDE = {
  seller: { include: { sellerProfile: true } },
  brand: true,
  model: true,
  partCategory: true,
  accessoryCategory: true,
  images: { orderBy: { position: 'asc' as const } },
} satisfies Prisma.ListingInclude;

type ListingWithRelations = Prisma.ListingGetPayload<{ include: typeof LISTINGS_INCLUDE }>;

function serializeListing(listing: ListingWithRelations) {
  const profile = listing.seller.sellerProfile;
  return {
    id: listing.id,
    type: listing.type,
    title: listing.title,
    price: listing.price,
    condition: listing.condition,
    city: listing.city,
    district: listing.district ?? undefined,
    status: listing.status,
    isFeatured: listing.isFeatured,
    createdAt: listing.createdAt.toISOString(),
    seller: {
      id: listing.seller.id,
      firstName: listing.seller.firstName,
      avatar: listing.seller.avatar ?? undefined,
      isVerifiedSeller: listing.seller.isVerifiedSeller,
      sellerType: profile?.type ?? 'INDIVIDUAL',
      businessName: profile?.businessName ?? undefined,
      averageRating: 0,
    },
    primaryImage: listing.images[0] ?? undefined,
    // Motos
    brand: listing.brand ?? undefined,
    model: listing.model ?? undefined,
    year: listing.year ?? undefined,
    mileage: listing.mileage ?? undefined,
    engineCc: listing.engineCc ?? undefined,
    // Pièces
    partCategory: listing.partCategory ?? undefined,
    compatibleBrands: listing.compatibleBrands ?? undefined,
    partReference: listing.partReference ?? undefined,
    // Accessoires
    accessoryCategory: listing.accessoryCategory ?? undefined,
    accessorySize: listing.accessorySize ?? undefined,
    accessoryColor: listing.accessoryColor ?? undefined,
    accessoryBrand: listing.accessoryBrand ?? undefined,
  };
}

// ═══════════════════════════════════════════════
// Liste des annonces publiques (filtres, tri, pagination)
// ═══════════════════════════════════════════════
export async function listListings(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10) || 20));
    const type = String(req.query.type ?? '') as '' | 'MOTORCYCLE' | 'PART' | 'ACCESSORY';
    const search = String(req.query.search ?? '').trim();
    const sort = String(req.query.sort ?? 'newest');

    const where: Prisma.ListingWhereInput = {
      status: 'ACTIVE',
      ...(type && { type }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.ListingOrderByWithRelationInput[] = (() => {
      switch (sort) {
        case 'price_asc': return [{ price: 'asc' }, { createdAt: 'desc' }];
        case 'price_desc': return [{ price: 'desc' }, { createdAt: 'desc' }];
        case 'mileage_asc': return [{ mileage: 'asc' }, { createdAt: 'desc' }];
        case 'year_desc': return [{ year: 'desc' }, { createdAt: 'desc' }];
        default: return [{ createdAt: 'desc' }];
      }
    })();

    const [total, items] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: LISTINGS_INCLUDE,
      }),
    ]);

    res.json({
      data: items.map(serializeListing),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════
// Détail d'une annonce publique
// ═══════════════════════════════════════════════
export async function getListingById(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id as string, status: { in: ['ACTIVE', 'SOLD'] } },
      include: {
        ...LISTINGS_INCLUDE,
        _count: { select: { favorites: true } },
      },
    });

    if (!listing) {
      throw new ApiError(404, 'Annonce non trouvée', 'NOT_FOUND');
    }

    const { _count, ...rest } = listing as unknown as ListingWithRelations & {
      _count: { favorites: number };
    };

    res.json({
      ...serializeListing(rest as ListingWithRelations),
      sellerId: listing.sellerId,
      description: listing.description,
      isPriceNegotiable: listing.isPriceNegotiable,
      motorcycleCategory: listing.motorcycleCategory ?? undefined,
      fuel: listing.fuel ?? undefined,
      transmission: listing.transmission ?? undefined,
      publishedAt: listing.publishedAt?.toISOString(),
      maintenanceInfo: listing.maintenanceInfo ?? undefined,
      papersInfo: listing.papersInfo ?? undefined,
      modifications: listing.modifications ?? undefined,
      viewsCount: listing.viewsCount,
      favoritesCount: _count.favorites,
      images: listing.images,
    });
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════
// Upload de photos (multipart, ≤ 15 fichiers, ≤ 5 Mo chacun)
// ═══════════════════════════════════════════════
export async function uploadListingImages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    requireStorage();

    const listingId = req.params.id as string;
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { sellerId: true },
    });

    if (!listing) {
      throw new ApiError(404, 'Annonce non trouvée', 'NOT_FOUND');
    }
    if (listing.sellerId !== req.user?.id) {
      throw new ApiError(403, 'Pas le propriétaire de cette annonce', 'FORBIDDEN');
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      throw new ApiError(400, 'Aucune image fournie', 'NO_IMAGES');
    }

    const existingCount = await prisma.listingImage.count({
      where: { listingId },
    });

    const created: Array<{ id: string; url: string; position: number; isPrimary: boolean }> = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const ext = ALLOWED_MIME[file.mimetype] || '.jpg';
      const key = `uploads/listings/${listingId}/${randomUUID()}${ext}`;

      await putObject(key, file.buffer, file.mimetype);

      const position = existingCount + i;
      const image = await prisma.listingImage.create({
        data: {
          listingId,
          url: key,
          position,
          isPrimary: position === 0,
        },
        select: { id: true, url: true, position: true, isPrimary: true },
      });

      created.push({
        id: image.id,
        url: image.url,
        position: image.position,
        isPrimary: image.isPrimary,
      });
    }

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════
// Suppression d'une photo
// ═══════════════════════════════════════════════
export async function deleteListingImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    requireStorage();

    const listingId = req.params.id as string;
    const imageId = req.params.imageId as string;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { sellerId: true },
    });

    if (!listing) {
      throw new ApiError(404, 'Annonce non trouvée', 'NOT_FOUND');
    }
    if (listing.sellerId !== req.user?.id) {
      throw new ApiError(403, 'Pas le propriétaire de cette annonce', 'FORBIDDEN');
    }

    const image = await prisma.listingImage.findFirst({
      where: { id: imageId, listingId },
    });

    if (!image) {
      throw new ApiError(404, 'Image non trouvée', 'NOT_FOUND');
    }

    await deleteObject(image.url);

    await prisma.listingImage.delete({ where: { id: imageId } });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════
// Proxy de lecture des fichiers (URL publique stable)
// ═══════════════════════════════════════════════
export async function getFile(req: Request, res: Response, next: NextFunction) {
  try {
    const rawKey = req.params[0];
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
    if (typeof key !== 'string' || !key) {
      throw new ApiError(404, 'Fichier introuvable', 'NOT_FOUND');
    }

    const object = await getObjectStream(decodeURIComponent(key));

    if (!object || !object.Body) {
      throw new ApiError(404, 'Fichier introuvable', 'NOT_FOUND');
    }

    res.setHeader('Content-Type', object.ContentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    (object.Body as NodeJS.ReadableStream).pipe(res);
  } catch (error) {
    next(error);
  }
}