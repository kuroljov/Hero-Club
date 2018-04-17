// @flow

function randStr (): string {
  return Math.random().toString(36).slice(2, 10)
}

export default class Id {
  hash: [string, string]
  timestamp: string

  constructor () {
    this.hash = [randStr(), randStr()]
    this.timestamp = Date.now().toString(36)
  }

  get createdAt (): Date {
    return new Date(parseInt(this.timestamp, 36))
  }

  get id (): string {
    return [this.timestamp, ...this.hash].join('-')
  }
}
