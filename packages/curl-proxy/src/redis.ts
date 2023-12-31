
import Redis from 'ioredis'
import { getContentHash } from './helpers'

export const initRedis = (enableCache, host) => {
  const exTime = 60 * 60 * 2
  const redis = enableCache ? new Redis({
    port: 6379,
    host: 'localhost',
    password: '',
    db: 0,
  }) : null

  redis?.on('error', (err) => {
    console.log('ioredis:', err)
  })

  const cacheHandler = async (opt) => {
    if (!enableCache || !redis) {
      return {
        cached: '',
      }
    }
    const cacheKey = host.replace(/https?:\/\//, '') + getContentHash(JSON.stringify(opt), 8)
    const cached = await redis.get(cacheKey)

    return {
      cached,
      setCache (data) {
        const val = JSON.stringify(data)
        val.length < 45000 && redis.set(cacheKey, val, 'EX', exTime)
      },
    }
  }

  return {
    cacheHandler,
  }
}
