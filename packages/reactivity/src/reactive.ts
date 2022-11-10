import { isObject } from '@pudge-fe/utils'
import { track, trigger } from './effect'

type KeyField<T> = keyof T

export function reactive<T extends object>(object: T): T {
  return new Proxy(object, {
    get(target, key) {
      const value: any = target[key as KeyField<typeof object>]
      track(target, 'get', key as KeyField<typeof object>)
      return isObject(value) ? reactive(value) : value
    },
    set(target, key, value) {
      target[key as KeyField<typeof object>] = value
      // const result = Reflect.set(target, key, value, receiver)
      trigger(target, 'set', key as KeyField<typeof object>)
      return true
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      trigger(target, 'delete', key as KeyField<typeof object>)
      return result
    },
    // TODO defineProperty, delete, has, ownKeys
  })
}
