import { Router } from 'express';
import { getFile } from '../controllers/listing.controller';

const router = Router();

// Proxy public : /api/files/<key> sert les images depuis le bucket S3
router.get('/*', getFile);

export { router as fileRouter };