import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config();

export type JwtExpiresIn = SignOptions['expiresIn'];

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  jwtExpiresIn: '15m' as JwtExpiresIn,
  jwtRefreshExpiresIn: '7d' as JwtExpiresIn,
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || '',
    bucket: process.env.STORAGE_BUCKET || '',
    accessKey: process.env.STORAGE_ACCESS_KEY || '',
    secretKey: process.env.STORAGE_SECRET_KEY || '',
  },
  payment: {
    apiKey: process.env.PAYMENT_API_KEY || '',
    secret: process.env.PAYMENT_SECRET || '',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
