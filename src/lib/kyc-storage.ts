// Where KYC identity documents are kept, and how they come back out.
//
// An ID scan is the most sensitive thing the site stores, so it is handled
// differently from every other upload:
// - It is never given a public URL. The row stores the object key, and staff
//   read the file through /admin/kyc/<id>/document/<side>, which checks the
//   session first.
// - It goes to R2_KYC_BUCKET_NAME when that is set — a bucket with no public
//   access. Without it the file lands in the main bucket under kyc/ with an
//   unguessable key, which keeps it out of reach only for as long as nobody
//   learns the key. Only production sets the private bucket (business
//   decision 2026-11-03); dev and staging use the fallback, so test them
//   with dummy images, never a real customer's ID.
// - It is marked private, no-store, so no cache in between keeps a copy.

import crypto from "node:crypto";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { ID_FILE_TYPES, type IdFileKind } from "@/lib/kyc";
import { BUCKET_NAME, r2 } from "@/lib/r2";

const KYC_BUCKET = process.env.R2_KYC_BUCKET_NAME || BUCKET_NAME;

export async function putKycDocument(
  submissionId: string,
  side: "front" | "back",
  bytes: Buffer,
  kind: IdFileKind,
): Promise<{ key: string; contentType: string }> {
  const { contentType, ext } = ID_FILE_TYPES[kind];
  const key = `kyc/${submissionId}/${side}-${crypto.randomBytes(16).toString("hex")}.${ext}`;
  await r2.send(
    new PutObjectCommand({
      Bucket: KYC_BUCKET,
      Key: key,
      Body: bytes,
      ContentType: contentType,
      CacheControl: "private, no-store",
    }),
  );
  return { key, contentType };
}

export async function getKycDocument(key: string): Promise<Buffer | null> {
  try {
    const object = await r2.send(
      new GetObjectCommand({ Bucket: KYC_BUCKET, Key: key }),
    );
    if (!object.Body) return null;
    return Buffer.from(await object.Body.transformToByteArray());
  } catch (error) {
    console.error("[kyc] document read failed", key, error);
    return null;
  }
}
