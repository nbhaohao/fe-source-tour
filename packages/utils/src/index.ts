export function isObject(val: any): val is object {
  return typeof val === 'object' && val !== null
}

export function isOn(key: string): boolean {
  return key[0] === 'o' && key[1] === 'n'
}
