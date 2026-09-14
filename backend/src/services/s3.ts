import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
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
  forcePathStyle: config.storage.forcePathStyle,
});

function toStorageError(error: unknown, action: string): Error {
  const err = error as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } };
  // Détails côté logs Render (sans secret), message sûr côté client.
  console.error(`[S3] ${action} failed:`, err?.name, err?.message, 'status:', err?.$metadata?.httpStatusCode);
  return new ApiError(
    502,
    `Échec d'envoi de l'image vers le stockage (${err?.name || 'erreur réseau'}). Vérifiez la configuration S3 du serveur.`,
    'STORAGE_UPLOAD_FAILED'
  );
}

export function requireStorage() {
  if (!config.storage.endpoint || !config.storage.bucket || !config.storage.accessKeyId || !config.storage.secretAccessKey) {
    throw new ApiError(500, 'Stockage S3 non configuré', 'STORAGE_NOT_CONFIGURED');
  }
}

// Vérifie que le bucket existe, le crée sinon (évite NoSuchBucket à l'upload).
// Ne bloque pas le démarrage : un simple avertissement est loggé en cas d'échec.
export async function ensureBucketExists(): Promise<void> {
  const Bucket = config.storage.bucket;
  try {
    await s3.send(new HeadBucketCommand({ Bucket }));
    console.log(`[S3] Bucket OK: ${Bucket}`);
  } catch (error) {
    if (isS3NotFound(error)) {
      console.log(`[S3] Bucket manquant, création de "${Bucket}"…`);
      await s3.send(new CreateBucketCommand({ Bucket }));
      console.log(`[S3] Bucket créé: ${Bucket}`);
    } else {
      const err = error as { name?: string; message?: string };
      console.warn(`[S3] Vérification du bucket impossible (${err?.name}: ${err?.message}) — l'upload risque d'échouer.`);
    }
  }
}

export function buildFileUrl(host: string, key: string): string {
  return `${host}/api/files/${key}`;
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: config.storage.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
  } catch (error) {
    throw toStorageError(error, 'putObject');
  }
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