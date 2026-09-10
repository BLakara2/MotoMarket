import { Router } from 'express';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware';
import { uploadImages } from '../middlewares/upload.middleware';
import { uploadListingImages, deleteListingImage } from '../controllers/listing.controller';

const router = Router();

// TODO: implémenter les opérations CRUD des annonces
router.get('/', optionalAuth, (_req, res) => {
  res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
});

router.get('/:id', optionalAuth, (_req, res) => {
  res.status(404).json({ message: 'Non implémenté' });
});

router.post('/', authMiddleware, (_req, res) => {
  res.status(201).json({ message: 'Non implémenté' });
});

router.put('/:id', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.delete('/:id', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.patch('/:id/status', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

// Photos
router.post('/:id/images', authMiddleware, uploadImages.array('images', 15), uploadListingImages);

router.delete('/:id/images/:imageId', authMiddleware, deleteListingImage);

export { router as listingRouter };