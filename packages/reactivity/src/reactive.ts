import { isObject } from '@pudge-fe/utils'
import { track, trigger } from './effect'

type KeyField<T> = keyof T

export function reactive<T extends object>(object: T): T {
  return new Proxy(object, {
    get(target, key, receiver) {
      const value: any = Reflect.get(target, key, receiver)
      track(target, 'get', key as KeyField<typeof object>)
      return isObject(value) ? reactive(value) : value
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, 'set', key as KeyField<typeof object>)
      return result
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      trigger(target, 'delete', key as KeyField<typeof object>)
      return result
    },
    // TODO defineProperty, delete, has, ownKeys
  })
}
