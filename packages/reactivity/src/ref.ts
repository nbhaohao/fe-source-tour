import { track, trigger } from './effect'

export function ref<T>(value: T): { value: T } {
  return new RefImpl(value)
}

class RefImpl {
  isRef: boolean
  _value: any
  constructor(value: any) {
    this.isRef = true
    this._value = value
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
