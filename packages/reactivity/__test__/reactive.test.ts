import { describe, expect, it, vi } from 'vitest'
import { effect, reactive, ref } from '../src'

describe('reactive', () => {
  describe('reactive and effect', () => {
    it('should call effect callback when it initializes and the object is changed', () => {
      const object: { name?: string; count: number } = reactive({
        count: 1,
        name: 'pudge',
      })
      let dummy
      effect(() => {
        dummy = object.count
      })
      expect(dummy).toBe(1)
      object.count++
      expect(dummy).toBe(2)
      let dummy2
      effect(() => {
        dummy2 = object.name
      })
      expect(dummy2).toBe('pudge')
      delete object.name
      expect(dummy2).toBeUndefined()
    })
    it('should support nest object', () => {
      const object = reactive({ info: { username: 'pudge' } })
      let dummy
      effect(() => {
        dummy = object.info.username
      })
      expect(dummy).toBe('pudge')
      object.info.username = 'egdup'
      expect(dummy).toBe('egdup')
    })
    it('should use reflect instead of using object operators', () => {
      const obj = {
        _count: 1,
        get count() {
          return this._count
        },
      }
      expect(obj.count).toBe(1)
      const result = reactive(obj)
      const fn = vi.fn(arg => arg)
      effect(() => {
        fn(result.count)
      })
      expect(fn).toBeCalledTimes(1)
      result._count++
      expect(fn).toBeCalledTimes(2)
    })
    // it.todo('should support set')
    it('should support set', () => {
      const set = reactive(new Set([1]))
      let value
      effect(() => {
        value = set.size
      })
      expect(value).toBe(1)
      set.add(2)
      expect(value).toBe(2)
      set.delete(2)
      expect(value).toBe(1)
    })
  })
  describe('ref', () => {
    it('should call effect callback when it initializes and the value is changed', () => {
      const num = ref(1)
      let dummy
      effect(() => {
        dummy = num.value
      })
      expect(num.value).toBe(1)
      num.value++
      expect(dummy).toBe(2)
    })
    it('should still work correct when param is object', () => {
      const num = ref({ count: 1 })
      let dummy
      effect(() => {
        dummy = num.value.count
      })
      expect(num.value.count).toBe(1)
      num.value.count++
      expect(dummy).toBe(2)
    })
  })
})
