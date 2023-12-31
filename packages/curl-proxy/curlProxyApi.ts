
import { CurlTool } from '@venus/utils'
import { exec } from 'child_process'

const isProd = process.env.NODE_ENV === 'production'

export const curlProxyApi = (req, res, next) => {
  if (isProd) {
    res.status(404).json({ code: -1, msg: 'not found' })
    return
  }
  try {
    if (req.headers['mock-curl']) {
      const options = JSON.parse(req.headers['mock-curl'])
      const curl = new CurlTool(options)
      const command = curl.getCommand()
      exec(command, (err, stdout, stderr) => {
        if (!err) {
          res.end(stdout)
        } else {
          res.status(404).json({
            err,
            command,
          })
        }
      })
      res.json({ code: 0, msg: 'ok' })
      return
    } else {
      res.end('curlProxyApi enabled')
    }
  } catch {
    // ignore
  }
}
