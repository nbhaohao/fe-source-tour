import { COLLECTION_KEY, REACTIVE_FLAGS } from './consts'
import { track, trigger } from './effect'

const collectionActions = {
  add(param: any) {
    const target = (this as any)[REACTIVE_FLAGS.RAW]
    const result = target.add(param)
    trigger(target, 'collection-add', param)
    return result
  },
  delete(param: any) {
    const target = (this as any)[REACTIVE_FLAGS.RAW]
    const result = target.delete(param)
    trigger(target, 'collection-delete', param)
    return result
  },
  has(param: any) {
    const target = (this as any)[REACTIVE_FLAGS.RAW]
    const result = target.has(param)
    trigger(target, 'collection-has', param)
    return result
  },
}

export const collectionHandler: ProxyHandler<any> = {
  get(target, key) {
    if (key === REACTIVE_FLAGS.RAW) {
      return target
    }
    if (key === 'size') {
      track(target, 'collection-size', COLLECTION_KEY)
      return Reflect.get(target, key)
    }
    return collectionActions[key as keyof typeof collectionActions]
  },
}
