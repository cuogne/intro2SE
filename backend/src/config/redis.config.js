const { Redis } = require('@upstash/redis')

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn(' UPSTASH_REDIS env vars not set — Redis will be unavailable')
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

module.exports = redis
