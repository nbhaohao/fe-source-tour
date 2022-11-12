import { isObject } from '@pudge-fe/utils'
import { track, trigger } from './effect'
import { reactive } from './reactive'

export const baseHandler: ProxyHandler<any> = {
  get(target, key, receiver) {
    const value: any = Reflect.get(target, key, receiver)
    track(target, 'get', key)
    return isObject(value) ? reactive(value) : value
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, 'set', key)
    return result
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key)
    trigger(target, 'delete', key)
    return result
  },
  // TODO defineProperty, delete, has, ownKeys
}
