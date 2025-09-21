import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, getSignedUrl } from '@/constents/s3';

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const { fileName, fileType } = data;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,// Optional: Set ACL to public-read if you want the file to be publicly accessible
      ACL: 'public-read'
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { message: 'Error generating signed URL' },
      { status: 500 }
    );
  }
}