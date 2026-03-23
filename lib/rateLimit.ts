// Simple in-memory IP-based rate limiter
// For production at scale, swap this out for Upstash Ratelimit
// https://github.com/upstash/ratelimit

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  // Maximum requests allowed within the window
  limit: number
  // Window duration in milliseconds
  windowMs: number
}

/**
 * Returns true if the request is allowed, false if rate limited.
 *
 * Usage:
 *   const allowed = rateLimit(ip, { limit: 5, windowMs: 60_000 })
 *   if (!allowed) return 429
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  // No entry or window has expired — reset
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  // Within window — check count
  if (entry.count >= limit) return false

  entry.count += 1
  return true
}

/**
 * Extract the real client IP from a Next.js request.
 * Falls back to 127.0.0.1 in development.
 */
export function getClientIp(
  headers: Headers
): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  )
}
