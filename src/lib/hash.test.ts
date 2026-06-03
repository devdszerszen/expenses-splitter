import { describe, it, expect } from 'vitest'
import { hashPin } from './hash'

describe('hashPin', () => {
  it('returns a 64-char hex string', async () => {
    const result = await hashPin('1234')
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[0-9a-f]+$/)
  })

  it('same pin produces same hash', async () => {
    const a = await hashPin('secret')
    const b = await hashPin('secret')
    expect(a).toBe(b)
  })

  it('different pins produce different hashes', async () => {
    const a = await hashPin('abc')
    const b = await hashPin('xyz')
    expect(a).not.toBe(b)
  })
})
