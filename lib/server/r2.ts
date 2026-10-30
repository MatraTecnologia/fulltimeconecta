import "server-only";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "" },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const bucket = (isPrivate: boolean) => (isPrivate ? process.env.R2_PRIVATE_BUCKET : process.env.R2_BUCKET)!;

export const publicUrl = (key: string) => `${process.env.R2_PUBLIC_URL}/${key}`;

export const presignPut = (key: string, contentType: string, size: number, isPrivate: boolean) =>
  getSignedUrl(r2, new PutObjectCommand({ Bucket: bucket(isPrivate), Key: key, ContentType: contentType, ContentLength: size }), { expiresIn: 600 });

export const presignGet = (key: string) => getSignedUrl(r2, new GetObjectCommand({ Bucket: bucket(true), Key: key }), { expiresIn: 300 });

export const removeObject = (key: string, isPrivate = false) => r2.send(new DeleteObjectCommand({ Bucket: bucket(isPrivate), Key: key }));
