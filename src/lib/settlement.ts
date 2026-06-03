import type { Settlement, Team } from '../types'

export function calculateSettlement(totalA: number, totalB: number): Settlement {
  const diff = totalA - totalB
  if (Math.abs(diff) < 0.01) {
    return { diff: 0, owingTeam: null, owedTeam: null, amount: 0, isEven: true }
  }
  const owingTeam: Team = diff > 0 ? 'b' : 'a'
  const owedTeam: Team = diff > 0 ? 'a' : 'b'
  return {
    diff,
    owingTeam,
    owedTeam,
    amount: Math.abs(diff) / 2,
    isEven: false,
  }
}
