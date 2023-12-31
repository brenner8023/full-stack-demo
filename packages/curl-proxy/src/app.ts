
import express from 'express'
import type { Express } from 'express'

export const runApp = (config) => {
  const app = express()
  init(app)

  app.use('/', (req, res, next) => {
    res.json({
      code: 0,
      msg: 'ok',
    })
  })

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
