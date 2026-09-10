import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { config } from '../config';
import { ApiError } from '../middlewares/error.middleware';

const s3 = new S3Client({
  region: config.storage.region,
  endpoint: config.storage.endpoint || undefined,
  credentials: {
    accessKeyId: config.storage.accessKeyId,
    secretAccessKey: config.storage.secretAccessKey,
  },
  forcePathStyle: true,
});

export function requireStorage() {
  if (!config.storage.endpoint || !config.storage.bucket || !config.storage.accessKeyId || !config.storage.secretAccessKey) {
    throw new ApiError(500, 'Stockage S3 non configuré', 'STORAGE_NOT_CONFIGURED');
  }
}

export function buildFileUrl(host: string, key: string): string {
  return `${host}/api/files/${key}`;
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
}

export async function deleteObject(key: string) {
  try {
    await s3.send(
      new DeleteObjectCommand({ Bucket: config.storage.bucket, Key: key })
    );
  } catch (error) {
    if (isS3NotFound(error)) return;
    throw error;
  }
}

export async function getObjectStream(key: string) {
  try {
    return await s3.send(
      new GetObjectCommand({ Bucket: config.storage.bucket, Key: key })
    );
  } catch (error) {
    if (isS3NotFound(error)) return null;
    throw error;
  }
}

function isS3NotFound(error: unknown): boolean {
  const name = (error as { name?: string })?.name ?? '';
  return name === 'NotFound' || name === 'NoSuchKey' || name === 'NoSuchBucket';
}