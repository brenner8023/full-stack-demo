
import express from 'express'
import type { Express } from 'express'
import type { Config } from './types'

import { getProxyHandler } from './proxy'

export const runApp = (config: Config) => {
  const app = express()
  init(app)

  app.use('/', getProxyHandler(config.enableCache, config.host))

  return app
}

const init = (app: Express) => {
  const bodyParser = {
    json: express.json,
    urlencoded: express.urlencoded,
    raw: express.raw,
  }
  app.use(bodyParser.json({
    limit: '10mb',
  }))
  app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: false,
  }))
  app.use(bodyParser.raw({
    limit: '10mb',
    type: 'text/plain',
  }))
}
