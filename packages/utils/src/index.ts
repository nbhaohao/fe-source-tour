export function isObject(val: any): val is object {
  return typeof val === 'object' && val !== null
}

export function isOn(key: string): boolean {
  return key[0] === 'o' && key[1] === 'n'
}

export function toRawType(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1)
}
