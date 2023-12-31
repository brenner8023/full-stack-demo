
interface Option {
  url: string
  method: string
  headers: Record<string, string>
  data?: Record<string, any>
  query?: Record<string, string>
}

export class CurlTool {
  constructor (option: Option) {
      this.processOption(option)
  }

  private option: Option

  private processOption (option: Option) {
      this.option = {
          ...option,
          url: option.url.replace(/\/+$/, ''),
          method: option.method.toUpperCase(),
      }
  }

  private processSpecial (content: string) {
      if (content.includes(`'`)) {
          return '$' + `'${content.replace(/'/g, `\\'`)}'`
      }
      return `'${content}'`
  }

  private getMethod () {
      return `-X '${this.option.method}'`
  }

  private getHeaders () {
      return Object.entries(this.option.headers).map(([key, val]) => {
          const header = this.processSpecial(`${key}: ${val}`)
          return `-H ${header}`
      }).join(' ')
  }

  private getBody () {
      const hasBody = !!this.option.data && this.option.method !== 'GET'
      if (hasBody) {
          const body = this.processSpecial(JSON.stringify(this.option.data))
          return `-d ${body}`
      }
      return ''
  }

  private getQuery () {
      if (!this.option.query) {
          return ''
      }
      const content = Object.entries(this.option.query).map(([key, val]) => `${key}=${val}`).join('&')
      return `?${content}`
  }

  private getUrl () {
      return this.processSpecial(this.option.url + this.getQuery())
  }

  getCommand () {
      const content = [this.getUrl(), this.getMethod(), this.getBody(), this.getHeaders(), '--compressed'].join(' ')
      return `curl ${content}`.trim().replace(/\s{2,}/g, ' ')
  }
}
