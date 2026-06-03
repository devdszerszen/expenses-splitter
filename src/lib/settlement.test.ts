import { describe, it, expect } from 'vitest'
import { calculateSettlement } from './settlement'

describe('calculateSettlement', () => {
  it('returns even when totals match', () => {
    const result = calculateSettlement(100, 100)
    expect(result.isEven).toBe(true)
    expect(result.amount).toBe(0)
    expect(result.owingTeam).toBeNull()
  })

  it('team b owes team a when a has higher total', () => {
    const result = calculateSettlement(200, 100)
    expect(result.owingTeam).toBe('b')
    expect(result.owedTeam).toBe('a')
    expect(result.amount).toBe(50)
    expect(result.isEven).toBe(false)
  })

  it('team a owes team b when b has higher total', () => {
    const result = calculateSettlement(100, 200)
    expect(result.owingTeam).toBe('a')
    expect(result.owedTeam).toBe('b')
    expect(result.amount).toBe(50)
  })

  it('treats difference smaller than 0.01 as even', () => {
    const result = calculateSettlement(100.001, 100)
    expect(result.isEven).toBe(true)
  })
})
