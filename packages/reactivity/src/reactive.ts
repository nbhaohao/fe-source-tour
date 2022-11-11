import { isObject, toRawType } from '@pudge-fe/utils'
import { track, trigger } from './effect'

const enum TARGET_TYPE {
  INVALID = 0,
  COMMON = 1, // general object
  COLLECTION = 2, // set map
}

function targetTypeMap(type: string): TARGET_TYPE {
  switch (type) {
    case 'Object':
    case 'Array':
      return TARGET_TYPE.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TARGET_TYPE.COLLECTION
    default:
      return TARGET_TYPE.INVALID
  }
}

const baseHandler: ProxyHandler<any> = {
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

const collectionActions = {
  add(param: any) {
    const target = (this as any).__reactive_raw
    const result = target.add(param)
    trigger(target, 'collection-add', param)
    return result
  },
  delete() {},
  has() {},
}

const collectionHandler: ProxyHandler<any> = {
  get(target, key) {
    if (key === '__reactive_raw') {
      return target
    }
    if (key === 'size') {
      track(target, 'collection-size', key)
      return Reflect.get(target, key)
    }
    return collectionActions[key as keyof typeof collectionActions]
  },
}

export function reactive<T extends object>(object: T): T {
  const handler =
    targetTypeMap(toRawType(object)) === TARGET_TYPE.COMMON
      ? baseHandler
      : collectionHandler

  return new Proxy(object, handler)
}
