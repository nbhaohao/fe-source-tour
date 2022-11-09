export function isObject(val: any): boolean {
  return typeof val === 'object' && val !== null
}

export function isOn(key: string): boolean {
  return key[0] === 'o' && key[1] === 'n'
}
