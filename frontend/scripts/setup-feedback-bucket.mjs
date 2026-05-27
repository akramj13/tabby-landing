// One-off, idempotent setup for the feedback screenshots bucket.
// Run from the frontend/ directory:
//   node --env-file=.env.local scripts/setup-feedback-bucket.mjs
//
// Values mirror app/lib/feedback.ts — keep them in sync if you change limits.
import { createClient } from "@supabase/supabase-js";

const BUCKET = "feedback-screenshots";
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/setup-feedback-bucket.mjs",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: buckets, error: listError } =
  await supabase.storage.listBuckets();

if (listError) {
  console.error("Failed to list buckets:", listError.message);
  process.exit(1);
}

if (buckets.some((bucket) => bucket.name === BUCKET)) {
  console.log(`Bucket "${BUCKET}" already exists — nothing to do.`);
  process.exit(0);
}

const { error: createError } = await supabase.storage.createBucket(BUCKET, {
  public: true,
  fileSizeLimit: 5_000_000, // 5 MB; matches MAX_SCREENSHOT_BYTES in app/lib/feedback.ts
  allowedMimeTypes: ALLOWED_MIME_TYPES,
});

if (createError) {
  console.error(`Failed to create bucket "${BUCKET}":`, createError.message);
  process.exit(1);
}

console.log(`Created public bucket "${BUCKET}".`);
