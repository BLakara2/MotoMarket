import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
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
// Création d'une annonce (toujours en DRAFT — la publication
// avec vérification des 3 photos min se fait via PATCH /:id/status)
// ═══════════════════════════════════════════════
const uuidSchema = z.string().uuid('Identifiant invalide');

const createListingSchema = z.object({
  type: z.enum(['MOTORCYCLE', 'PART', 'ACCESSORY']),
  title: z.string().trim().min(5, 'Titre trop court (5 caractères min)').max(100),
  description: z.string().trim().min(20, 'Description trop courte (20 caractères min)').max(5000),
  price: z.coerce.number().int('Prix invalide').min(0, 'Prix invalide'),
  isPriceNegotiable: z.coerce.boolean().optional().default(false),
  condition: z.enum(['NEUF', 'TRES_BON', 'BON', 'USAGE', 'A_REFORMER']),
  city: z.string().trim().min(1, 'Ville requise').max(100),
  district: z.string().trim().max(100).optional().or(z.literal('')),

  // Moto
  brandId: uuidSchema.optional(),
  modelId: uuidSchema.optional(),
  motorcycleCategory: z.enum(['CROSS', 'ROUTE', 'ROADSTER', 'SCOOTER', 'TRAIL', 'CUSTOM', 'AUTRE']).optional(),
  year: z.coerce.number().int().min(1950).max(2030).optional(),
  mileage: z.coerce.number().int().min(0).optional(),
  engineCc: z.coerce.number().int().min(50).max(2000).optional(),
  fuel: z.enum(['ESSENCE', 'DIELECTRIQUE', 'HYBRIDE', 'ELECTRIQUE']).optional(),
  transmission: z.enum(['MANUELLE', 'AUTOMATIQUE', 'SEMI_AUTO']).optional(),
  maintenanceInfo: z.string().trim().max(5000).optional().or(z.literal('')),
  papersInfo: z.string().trim().max(5000).optional().or(z.literal('')),
  modifications: z.string().trim().max(5000).optional().or(z.literal('')),

  // Pièce
  partCategoryId: uuidSchema.optional(),
  compatibleBrands: z.string().trim().max(500).optional().or(z.literal('')),
  partReference: z.string().trim().max(100).optional().or(z.literal('')),

  // Accessoire
  accessoryCategoryId: uuidSchema.optional(),
  accessoryBrand: z.string().trim().max(100).optional().or(z.literal('')),
  accessorySize: z.string().trim().max(50).optional().or(z.literal('')),
  accessoryColor: z.string().trim().max(50).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.type === 'MOTORCYCLE') {
    if (!data.brandId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['brandId'], message: 'Marque requise' });
    if (!data.modelId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['modelId'], message: 'Modèle requis' });
    if (data.year === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['year'], message: 'Année requise' });
    if (data.mileage === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mileage'], message: 'Kilométrage requis' });
    if (data.engineCc === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['engineCc'], message: 'Cylindrée requise' });
  }
  if (data.type === 'PART' && !data.partCategoryId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['partCategoryId'], message: 'Catégorie requise' });
  }
  if (data.type === 'ACCESSORY' && !data.accessoryCategoryId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['accessoryCategoryId'], message: 'Catégorie requise' });
  }
});

const emptyToUndefined = (v: string | undefined) => (v === undefined || v === '' ? undefined : v);

export async function createListing(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createListingSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Données invalides', 'VALIDATION_ERROR', parsed.error.issues.map((i) => ({
        field: i.path.join('.') || 'body',
        message: i.message,
      })));
    }
    const data = parsed.data;
    const sellerId = req.user!.id;

    // Vérifier les clés étrangères selon le type
    if (data.type === 'MOTORCYCLE') {
      const brand = await prisma.brand.findUnique({ where: { id: data.brandId! } });
      if (!brand) throw new ApiError(400, 'Marque introuvable', 'BRAND_NOT_FOUND');
      const model = await prisma.motorcycleModel.findFirst({
        where: { id: data.modelId!, brandId: data.brandId! },
      });
      if (!model) throw new ApiError(400, 'Modèle introuvable pour cette marque', 'MODEL_NOT_FOUND');
    }
    if (data.type === 'PART' && data.partCategoryId) {
      const cat = await prisma.partCategory.findUnique({ where: { id: data.partCategoryId } });
      if (!cat) throw new ApiError(400, 'Catégorie de pièce introuvable', 'CATEGORY_NOT_FOUND');
    }
    if (data.type === 'ACCESSORY' && data.accessoryCategoryId) {
      const cat = await prisma.accessoryCategory.findUnique({ where: { id: data.accessoryCategoryId } });
      if (!cat) throw new ApiError(400, "Catégorie d'accessoire introuvable", 'CATEGORY_NOT_FOUND');
    }

    const listing = await prisma.listing.create({
      data: {
        sellerId,
        type: data.type,
        title: data.title,
        description: data.description,
        price: data.price,
        isPriceNegotiable: data.isPriceNegotiable ?? false,
        condition: data.condition,
        city: data.city,
        district: emptyToUndefined(data.district),
        status: 'DRAFT',
        brandId: data.brandId,
        modelId: data.modelId,
        motorcycleCategory: data.motorcycleCategory,
        year: data.year,
        mileage: data.mileage,
        engineCc: data.engineCc,
        fuel: data.fuel,
        transmission: data.transmission,
        maintenanceInfo: emptyToUndefined(data.maintenanceInfo),
        papersInfo: emptyToUndefined(data.papersInfo),
        modifications: emptyToUndefined(data.modifications),
        partCategoryId: data.partCategoryId,
        compatibleBrands: emptyToUndefined(data.compatibleBrands),
        partReference: emptyToUndefined(data.partReference),
        accessoryCategoryId: data.accessoryCategoryId,
        accessoryBrand: emptyToUndefined(data.accessoryBrand),
        accessorySize: emptyToUndefined(data.accessorySize),
        accessoryColor: emptyToUndefined(data.accessoryColor),
      },
      include: LISTINGS_INCLUDE,
    });

    res.status(201).json(serializeListing(listing));
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════
// Changement de statut (publication / pause / vente)
// Publication (ACTIVE) exige ≥ 3 photos
// ═══════════════════════════════════════════════
const MIN_IMAGES_TO_PUBLISH = 3;

export async function updateListingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({ status: z.enum(['ACTIVE', 'PAUSED', 'SOLD', 'DRAFT']) }).safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Statut invalide', 'VALIDATION_ERROR');
    }

    const listingId = req.params.id as string;
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { images: { select: { id: true } } },
    });

    if (!listing) {
      throw new ApiError(404, 'Annonce non trouvée', 'NOT_FOUND');
    }
    if (listing.sellerId !== req.user?.id) {
      throw new ApiError(403, "Pas le propriétaire de cette annonce", 'FORBIDDEN');
    }

    if (parsed.data.status === 'ACTIVE' && listing.images.length < MIN_IMAGES_TO_PUBLISH) {
      throw new ApiError(400, `Ajoutez au moins ${MIN_IMAGES_TO_PUBLISH} photos pour publier`, 'NOT_ENOUGH_IMAGES');
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 60);

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: parsed.data.status,
        ...(parsed.data.status === 'ACTIVE' && !listing.publishedAt
          ? { publishedAt: now, expiresAt }
          : {}),
      },
      include: LISTINGS_INCLUDE,
    });

    res.json(serializeListing(updated));
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════
// Référentiel public pour le formulaire de publication :
// marques + modèles, catégories pièces & accessoires
// ═══════════════════════════════════════════════
export async function getListingsMeta(_req: Request, res: Response, next: NextFunction) {
  try {
    const [brands, partCategories, accessoryCategories] = await Promise.all([
      prisma.brand.findMany({
        orderBy: { name: 'asc' },
        include: { motorcycleModels: { select: { id: true, name: true }, orderBy: { name: 'asc' } } },
      }),
      prisma.partCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.accessoryCategory.findMany({ orderBy: { name: 'asc' } }),
    ]);

    res.json({
      brands: brands.map((b) => ({
        id: b.id,
        name: b.name,
        models: b.motorcycleModels,
      })),
      partCategories,
      accessoryCategories,
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