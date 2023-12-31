
import { runApp } from './src/app'

const config = {
  PORT: 8888,
  host: 'https://m.jd.com/us',
  enableCache: true,
}

function main () {
  const app = runApp(config)
  app.listen(config.PORT, () => {
    console.log(`listening on port ${config.PORT}!`)
  })
}
main()
