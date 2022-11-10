import { describe, expect, it } from 'vitest'
import { effect, reactive, ref } from '../src'

describe('reactive', () => {
  describe('reactive and effect', () => {
    it('should call effect callback when it initializes and the object is changed', () => {
      const object = reactive({ count: 1 })
      let dummy
      effect(() => {
        dummy = object.count
      })
      expect(dummy).toBe(1)
      object.count++
      expect(dummy).toBe(2)
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
  })
})
