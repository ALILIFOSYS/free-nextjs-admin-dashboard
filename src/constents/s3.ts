import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
console.log(process.env.AW_REGION,"process.env.AW_REGION");
console.log(process.env.AW_ACCESS_KEY_ID,"process.env.AW_ACCESS_KEY_ID");
console.log(process.env.AW_SECRET_ACCESS_KEY,"process.env.AW_SECRET_ACCESS_KEY");
console.log(process.env.AW_S3_BUCKET_NAME,"process.env.AW_S3_BUCKET_NAME");

const s3Client = new S3Client({
  region: process.env.AW_REGION,
  credentials: {
    accessKeyId: process.env.AW_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AW_SECRET_ACCESS_KEY!,
  },
});

export { s3Client, getSignedUrl };