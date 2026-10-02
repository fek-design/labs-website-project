import { headers } from "next/headers";

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

// Global in-memory storage across requests in the Node process
const bucketStore = new Map<string, RateLimitBucket>();

// Periodic garbage collection every 10 minutes to evict stale buckets
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

if (typeof globalThis !== "undefined") {
  // Prevent duplicate intervals during Turbopack / Next.js Fast Refresh
  const globalObj = globalThis as unknown as { __rateLimitTimer?: NodeJS.Timeout };
  if (!globalObj.__rateLimitTimer) {
    globalObj.__rateLimitTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, bucket] of bucketStore.entries()) {
        // Evict if untouched for more than 15 minutes
        if (now - bucket.lastRefill > 15 * 60 * 1000) {
          bucketStore.delete(key);
        }
      }
    }, CLEANUP_INTERVAL_MS);
    if (globalObj.__rateLimitTimer.unref) {
      globalObj.__rateLimitTimer.unref();
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Token-bucket sliding window rate limiter (Zero Cloud Dependency)
 * 
 * @param key Unique identifier (e.g. "search:192.168.1.5" or "checkout:admin-uuid")
 * @param maxRequests Maximum tokens allowed within the window
 * @param windowSeconds Duration of the rate limit window in seconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 60,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const refillRatePerMs = maxRequests / windowMs;

  let bucket = bucketStore.get(key);

  if (!bucket) {
    bucket = {
      tokens: maxRequests - 1,
      lastRefill: now,
    };
    bucketStore.set(key, bucket);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: windowSeconds,
    };
  }

  // Refill tokens based on elapsed time
  const elapsedMs = now - bucket.lastRefill;
  const refilledTokens = elapsedMs * refillRatePerMs;
  bucket.tokens = Math.min(maxRequests, bucket.tokens + refilledTokens);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetInSeconds: Math.ceil((maxRequests - bucket.tokens) / (refillRatePerMs * 1000)),
    };
  }

  // Rate limit exceeded
  const timeToWaitMs = (1 - bucket.tokens) / refillRatePerMs;
  return {
    allowed: false,
    remaining: 0,
    resetInSeconds: Math.ceil(timeToWaitMs / 1000),
  };
}

/**
 * Helper to safely extract client IP or identifier inside Next.js Server Actions
 */
export async function getClientIdentifier(fallback: string = "local"): Promise<string> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  } catch {
    // If called outside of a request context
  }
  return fallback;
}
