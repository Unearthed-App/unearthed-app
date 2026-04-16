import type { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const MAX_INSERT_REQUESTS_PER_WINDOW = 30;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function pruneBuckets(now: number) {
  if (buckets.size < 2000) return;
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key);
  }
  if (buckets.size > 5000) {
    buckets.clear();
  }
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function isPublicExtInsertPath(pathname: string): boolean {
  return /^\/api\/public\/ext-(books|quotes)-insert\/?$/.test(pathname);
}

export function rateLimitPublicInsert(ip: string, pathname: string): boolean {
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  pruneBuckets(now);
  let bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }
  bucket.count++;
  return bucket.count <= MAX_INSERT_REQUESTS_PER_WINDOW;
}
