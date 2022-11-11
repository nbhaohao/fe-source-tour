import { describe, expect, it, vi } from 'vitest'
import { effect, reactive } from '../src'

describe('effect', () => {
  it('effect should work inside another side', () => {
    const data = { foo: true, bar: true }
    const object = reactive(data)
    let temp1, temp2
    const fn1 = vi.fn(() => {})
    const fn2 = vi.fn(() => {})
    effect(() => {
      fn1()
      effect(() => {
        fn2()
        temp2 = object.bar
      })
      temp1 = object.foo
    })
    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    expect(temp2).toBe(true)
    expect(temp1).toBe(true)
    object.foo = false
    expect(temp1).toBe(false)
    expect(fn1).toBeCalledTimes(2)
    // TODO FIX ME
    // expect(fn2).toBeCalledTimes(1)
  })
})
