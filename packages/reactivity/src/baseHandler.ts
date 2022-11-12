import { isObject } from '@pudge-fe/utils'
import { track, trigger } from './effect'
import { reactive } from './reactive'

function createGetter(isShadow?: boolean): ProxyHandler<any>['get'] {
  return (target, key, receiver) => {
    const value: any = Reflect.get(target, key, receiver)
    track(target, 'get', key)
    return isShadow ? value : isObject(value) ? reactive(value) : value
  }
}

const setter: ProxyHandler<any>['set'] = function (
  target,
  key,
  value,
  receiver,
) {
  const result = Reflect.set(target, key, value, receiver)
  trigger(target, 'set', key)
  return result
}

const deletePropertyHandler: ProxyHandler<any>['deleteProperty'] = function (
  target,
  key,
) {
  const result = Reflect.deleteProperty(target, key)
  trigger(target, 'delete', key)
  return result
}

export const baseHandler: ProxyHandler<any> = {
  get: createGetter(false),
  set: setter,
  deleteProperty: deletePropertyHandler,
}

export const shadowReactiveHandler: ProxyHandler<any> = {
  get: createGetter(true),
  set: setter,
  deleteProperty: deletePropertyHandler,
}
