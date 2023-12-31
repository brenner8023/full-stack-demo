
import crypto from 'crypto'
import os from 'os'
import type { Request } from 'express'

export const cacheLog = (msg: string) => console.log('\x1b[35m%s\x1b[0m', 'cache:' + msg)

export const okLog = (msg: string) => console.log('\x1b[36m%s\x1b[0m', 'ok:' + msg)

export const errLog = (msg: string, prefix = 'error:') => console.log(prefix + msg)

export const getShortUrl = (req: Request) => req.url.split('?')[0]

export const getContentHash = (content, length = 0) => {
  const result = crypto.createHash('md5').update(content).digest('hex')
  if (length) {
    return result.slice(0, length)
  }
  return result
}

const username = os.userInfo().username
export const addTagHeader = (headers: Request['headers']) => {
  return {
    ...headers,
    'sf-username': username,
  }
}
