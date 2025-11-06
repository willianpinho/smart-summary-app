/**
 * Application configuration
 *
 * This file centralizes environment variable access to ensure proper
 * handling in Next.js client components.
 */

/**
 * Get API URL from environment variable
 * In Next.js 15, NEXT_PUBLIC_* variables are injected at build time,
 * so we need to access them directly, not through process.env at runtime
 */
export const getApiUrl = (): string => {
  // For client-side, the env var is replaced at build time
  // For development, we default to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (typeof window !== 'undefined') {
    // Client-side: use the build-time injected value or default
    return apiUrl || 'http://localhost:8000'
  }

  // Server-side: use process.env
  return apiUrl || 'http://localhost:8000'
}

export const config = {
  apiUrl: getApiUrl(),
} as const
