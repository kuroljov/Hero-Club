// @flow

export default function obj2arr (obj?: Object): Array<mixed> {
  if (!obj) {
    return []
  }

  return Object
    .keys(obj)
    .reduce((acc, key: string) => {
      acc.push(obj[key])

      return acc
    }, [])
}
