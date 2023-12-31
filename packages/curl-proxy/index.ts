
import { runApp } from './src/app'
import type { Config } from './src/types'

const config: Config = {
  PORT: 8888,
  host: 'https://m.jd.com/us',
  enableCache: false,
}

function main () {
  const app = runApp(config)
  app.listen(config.PORT, () => {
    console.log(`http://127.0.0.1:${config.PORT}`)
  })
}
main()
