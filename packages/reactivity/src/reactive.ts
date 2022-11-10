import { track, trigger } from './effect'

export function reactive<T extends object>(object: T): T {
  return new Proxy(object, {
    get(target, key) {
      track(target, 'get', key as keyof typeof object)
      return target[key as keyof typeof object]
    },
    set(target, key, value) {
      target[key as keyof typeof object] = value
      // const result = Reflect.set(target, key, value, receiver)
      trigger(target, 'set', key as keyof typeof object)
      return true
    },
    // TODO defineProperty, delete, has, ownKeys
  })
}
