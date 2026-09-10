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

  return res.status(500).json({
    message: 'Erreur interne du serveur',
    code: 'INTERNAL_ERROR',
  });
}
