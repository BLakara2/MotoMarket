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
    endpoint: process.env.AWS_ENDPOINT_URL_S3 || process.env.STORAGE_ENDPOINT || '',
    region: process.env.AWS_REGION || 'eu-central-1',
    bucket: process.env.STORAGE_BUCKET || 'assets',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.STORAGE_SECRET_KEY || '',
  },
  payment: {
    apiKey: process.env.PAYMENT_API_KEY || '',
    secret: process.env.PAYMENT_SECRET || '',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export function isStorageConfigured(): boolean {
  const { endpoint, bucket, accessKeyId, secretAccessKey } = config.storage;
  return Boolean(endpoint && bucket && accessKeyId && secretAccessKey);
}
