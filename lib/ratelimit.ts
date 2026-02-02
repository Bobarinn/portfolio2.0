// Simple in-memory rate limiter
// For production, consider using Upstash Redis or Vercel KV

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000 // 1 minute default
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const entry = store[identifier];

  // No entry or window expired
  if (!entry || entry.resetAt < now) {
    store[identifier] = {
      count: 1,
      resetAt: now + windowMs,
    };
    return {
      success: true,
      remaining: limit - 1,
      reset: store[identifier].resetAt,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

export function getClientIp(request: Request): string {
  // Get IP from headers (works with Vercel)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

export function isOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // No origin header (same-origin or direct API call) - check host
  if (!origin) {
    return true; // Allow same-origin requests
  }

  // Always allow localhost for development
  if (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    host?.includes('localhost') ||
    host?.includes('127.0.0.1')
  ) {
    return true;
  }

  // Get allowed origins from environment variable
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];

  // Check if origin matches any allowed origin
  return allowedOrigins.some(allowed => {
    if (!allowed) return false;
    // Match exact domain or with protocol
    return origin.includes(allowed);
  });
}
