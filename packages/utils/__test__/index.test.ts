import { describe, it, expect } from 'vitest'
import { isObject, isOn, toRawType } from '../src'

describe('test utils', () => {
  describe('isObject', () => {
    it('should return correct result', () => {
      expect(isObject({})).toBe(true)
      expect(isObject(1)).toBe(false)
      expect(isObject(1)).toBe(false)
    })
  })
  describe('isOn', () => {
    it('should return correct result', () => {
      expect(isOn('onClick')).toBe(true)
      expect(isOn('')).toBe(false)
    })
  })
  describe('toRawType', () => {
    it('should return correct result', () => {
      expect(toRawType({})).toBe('Object')
      expect(toRawType([])).toBe('Array')
      expect(toRawType(new Map())).toBe('Map')
      expect(toRawType(new Set())).toBe('Set')
      expect(toRawType(new WeakMap())).toBe('WeakMap')
      expect(toRawType(new WeakSet())).toBe('WeakSet')
    })
  })
})
