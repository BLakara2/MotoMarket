import multer from 'multer';
import { ApiError } from './error.middleware';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const MAX_FILES = 15;
const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME[file.mimetype]) {
      return cb(
        new ApiError(
          400,
          `Format non supporté : ${file.mimetype} (JPG, PNG ou WebP uniquement)`,
          'INVALID_FILE_TYPE'
        )
      );
    }
    cb(null, true);
  },
});

export { ALLOWED_MIME, MAX_FILE_SIZE, MAX_FILES };