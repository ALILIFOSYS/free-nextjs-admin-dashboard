import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AW_REGION,
  credentials: {
    accessKeyId: process.env.AW_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AW_SECRET_ACCESS_KEY!,
  },
});

export { s3Client, getSignedUrl };