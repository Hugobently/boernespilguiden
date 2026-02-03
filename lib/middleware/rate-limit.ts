/**
 * Simple rate limiting middleware for API routes
 *
 * Tracks requests by IP address and enforces configurable limits.
 * No user accounts required - limits based on IP only.
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (consider Redis for production with multiple servers)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Rate limit configurations for different API endpoints
 */
export const rateLimits = {
  // Search endpoints - 100 requests per minute
  search: { windowMs: 60 * 1000, maxRequests: 100 },

  // General API - 1000 requests per hour
  api: { windowMs: 60 * 60 * 1000, maxRequests: 1000 },

  // Admin endpoints - 50 requests per minute
  admin: { windowMs: 60 * 1000, maxRequests: 50 },
};

/**
 * Get client IP from request headers
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback (shouldn't happen in production with reverse proxy)
  return 'unknown';
}

/**
 * Check if request should be rate limited
 *
 * @returns null if allowed, or an object with retry info if blocked
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): { blocked: boolean; retryAfter?: number; remaining?: number } {
  const ip = getClientIp(request);
  const key = `${ip}:${config.windowMs}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetTime < now) {
    // First request or window expired
    store.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      blocked: false,
      remaining: config.maxRequests - 1,
    };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      blocked: true,
      retryAfter,
    };
  }

  // Increment counter
  entry.count++;
  store.set(key, entry);

  return {
    blocked: false,
    remaining: config.maxRequests - entry.count,
  };
}

/**
 * Higher-order function to wrap API routes with rate limiting
 *
 * Usage:
 * ```typescript
 * export const GET = withRateLimit(rateLimits.search, async (request) => {
 *   // Your API logic here
 * });
 * ```
 */
export function withRateLimit<T extends (...args: any[]) => Promise<Response>>(
  config: RateLimitConfig,
  handler: T
): T {
  return (async (...args: any[]) => {
    const request = args[0] as Request;

    const limitCheck = checkRateLimit(request, config);

    if (limitCheck.blocked) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: limitCheck.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(limitCheck.retryAfter),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(
              Math.ceil(Date.now() / 1000) + (limitCheck.retryAfter || 0)
            ),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = await handler(...args);

    // Clone response to add headers
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Limit', String(config.maxRequests));
    headers.set('X-RateLimit-Remaining', String(limitCheck.remaining || 0));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }) as T;
}
