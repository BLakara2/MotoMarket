import { Router } from 'express';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware';
import { uploadImages } from '../middlewares/upload.middleware';
import {
  listListings,
  getListingById,
  createListing,
  updateListingStatus,
  getListingsMeta,
  uploadListingImages,
  deleteListingImage,
} from '../controllers/listing.controller';

const router = Router();

router.get('/', optionalAuth, listListings);

// Référentiel public (avant /:id pour ne pas être capturé)
router.get('/meta', getListingsMeta);

router.get('/:id', optionalAuth, getListingById);

router.post('/', authMiddleware, createListing);

router.put('/:id', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.delete('/:id', authMiddleware, (_req, res) => {
  res.json({ message: 'Non implémenté' });
});

router.patch('/:id/status', authMiddleware, updateListingStatus);

// Photos
router.post('/:id/images', authMiddleware, uploadImages.array('images', 15), uploadListingImages);

router.delete('/:id/images/:imageId', authMiddleware, deleteListingImage);

export { router as listingRouter };