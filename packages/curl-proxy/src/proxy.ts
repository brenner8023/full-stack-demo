
import qs from 'qs'
import axios from 'axios'

import { okLog, cacheLog, errLog, getShortUrl, addTagHeader } from './helpers'
import { doMock } from './mock'
import { initRedis } from './redis'
import type { ProxyOpt } from './types'

export const getProxyHandler = (enableCache, host) => {

  const { cacheHandler } = initRedis(enableCache, host)

  return async (req, res, next) => {
    try {
      const mocked = doMock(req, res)
      if (mocked) return
  
      const contentType = req.headers['content-type'] || ''
      const needQs = contentType.includes('x-www-form-urlencoded')
      const data = Object.assign({}, req.query, req.body)
      const opt: ProxyOpt = {
        method: req.method,
        url: req.url,
        data: needQs ? qs.stringify(data) : data,
      }
      const { cached, setCache } = await cacheHandler(opt)
      if (cached) {
        cacheLog(getShortUrl(req))
        res.json(JSON.parse(cached))
        return
      }
      const headers = {
        'mock-curl': JSON.stringify({
          ...opt,
          headers: addTagHeader(req.headers),  
        })
      }
      const axiosRes = await axios.get(`${host}/api/v1/__curl-proxy__`, { headers }).catch((err) => {
        errLog(getShortUrl(req), 'axios error:')
        res.status(500).json({ code: -1, msg: 'axios error' })
      })
      const axiosData = axiosRes?.data
      if (axiosData) {
        res.json(axiosData)
        setCache?.(axiosData)
        okLog(getShortUrl(req))
      } else {
        errLog(getShortUrl(req), 'data error:')
      }
    } catch (error) {
      errLog(getShortUrl(req), 'unknown error:')
      res.status(500).json({ code: -1, msg: 'error' })
    }
  }
}
