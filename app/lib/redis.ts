import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || "https://dummy-url.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN || "dummy-token",
})

