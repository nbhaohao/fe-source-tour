import {describe, it, expect} from "vitest";
import {isObject, isOn} from '../src'

describe('test utils', () => {
  describe('isObject', () => {
    it('should return correct result when passing some normal values', () => {
      expect(isObject({})).toBe(true)
      expect(isObject(1)).toBe(false)
      expect(isObject(1)).toBe(false)
    })
  })
  describe('isOn', () => {
    it('should return correct result when passing some normal values', () => {
      expect(isOn('onClick')).toBe(true)
      expect(isOn('')).toBe(false)
    })
  })
})
