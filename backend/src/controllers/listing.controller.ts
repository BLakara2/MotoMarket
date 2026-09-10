import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { prisma } from '../config/database';
import { ApiError } from '../middlewares/error.middleware';
import { ALLOWED_MIME } from '../middlewares/upload.middleware';
import { requireStorage, putObject, deleteObject, getObjectStream } from '../services/s3';

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