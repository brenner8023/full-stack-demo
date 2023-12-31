
import { getShortUrl } from './helpers'

const apiMocks = [
  {
    match: '/api/v1/vm/delete',
    status: 500,
    mock: { code: -1, msg: 'error' },
  }
]

export const doMock = (req, res) => {
  const shortUrl = getShortUrl(req)
  const apiMock = apiMocks.find((item) => shortUrl.includes(item.match))
  if (apiMock) {
    res.status(apiMock.status).json(apiMock.mock)
    console.log('mock:' + shortUrl)
    return true
  }
  return false
}
