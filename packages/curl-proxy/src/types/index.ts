
import type { Request } from 'express'

export interface Config {
  PORT: number
  host: string
  enableCache: boolean
}

export interface ProxyOpt {
  method: Request['method']
  url: Request['url']
  data: string | Record<string, any>
  headers?: Request['headers']
}
