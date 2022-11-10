import { isObject } from '@pudge-fe/utils'
import { track, trigger } from './effect'
import { reactive } from './reactive'

export function ref<T>(value: T): { value: T } {
  return new RefImpl(value)
}

class RefImpl {
  isRef: boolean
  _value: any
  constructor(value: any) {
    this.isRef = true
    this._value = convert(value)
  }

  get value() {
    track(this, 'ref-get', 'value')
    return this._value
  }

  set value(newValue) {
    if (newValue !== this._value) {
      this._value = newValue
      trigger(this, 'ref-set', 'value')
    }
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value
}
