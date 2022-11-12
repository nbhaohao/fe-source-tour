import { toRawType } from '@pudge-fe/utils'
import { baseHandler, shadowReactiveHandler } from './baseHandler'
import { collectionHandler } from './collectionHandler'

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

export function shadowReactive<T extends object>(object: T): T {
  const handler =
    targetTypeMap(toRawType(object)) === TARGET_TYPE.COMMON
      ? shadowReactiveHandler
      : collectionHandler
  return new Proxy(object, handler)
}

export function reactive<T extends object>(object: T): T {
  const handler =
    targetTypeMap(toRawType(object)) === TARGET_TYPE.COMMON
      ? baseHandler
      : collectionHandler

  return new Proxy(object, handler)
}
