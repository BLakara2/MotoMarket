import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiError extends Error {
  statusCode: number;
  code: string;
  errors?: Array<{ field: string; message: string }>;

  constructor(
    statusCode: number,
    message: string,
    code: string = 'ERROR',
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[Error] ${err.message}`, err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Erreurs d'upload Multer (hors fileFilter qui renvoie déjà un ApiError)
  if (err.name === 'MulterError') {
    const message =
      err.message === 'File too large' || (err as { code?: string }).code === 'LIMIT_FILE_SIZE'
        ? 'Image trop lourde (5 Mo maximum par photo)'
        : (err as { code?: string }).code === 'LIMIT_FILE_COUNT'
          ? 'Trop de fichiers (15 photos maximum)'
          : 'Échec de lecture des fichiers envoyés';
    return res.status(400).json({ message, code: 'UPLOAD_ERROR' });
  }

  return res.status(500).json({
    message: 'Erreur interne du serveur',
    code: 'INTERNAL_ERROR',
  });
}
