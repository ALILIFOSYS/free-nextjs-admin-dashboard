import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
console.log(process.env.NEXT_PUBLIC_AWS_REGION,"process.env.NEXT_PUBLIC_AWS_REGION");
console.log(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,"process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID");
console.log(process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,"process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY");
console.log(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,"process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME");

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export { s3Client, getSignedUrl };