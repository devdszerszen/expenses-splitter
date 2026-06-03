import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Scoreboard from './Scoreboard'
import type { Expense } from '../types'

const makeExpense = (team: 'a' | 'b', amount: number): Expense => ({
  id: crypto.randomUUID(),
  room_id: 'room-1',
  team,
  description: 'test',
  amount,
  created_at: new Date().toISOString(),
})

describe('Scoreboard', () => {
  it('shows team names and totals', () => {
    render(
      <Scoreboard
        teamAName="Szerszenie"
        teamBName="Kierony"
        expenses={[makeExpense('a', 100), makeExpense('b', 60)]}
        activeTeam="a"
        onTeamSelect={() => {}}
      />,
    )
    expect(screen.getAllByText('Szerszenie').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Kierony').length).toBeGreaterThan(0)
    expect(screen.getByText('100.00 zł')).toBeInTheDocument()
    expect(screen.getByText('60.00 zł')).toBeInTheDocument()
  })

  it('shows settlement verdict when teams differ', () => {
    render(
      <Scoreboard
        teamAName="Szerszenie"
        teamBName="Kierony"
        expenses={[makeExpense('a', 200), makeExpense('b', 100)]}
        activeTeam="a"
        onTeamSelect={() => {}}
      />,
    )
    // Settlement text spans multiple elements — check parent paragraph text content
    const verdict = screen.getByText((_content, element) =>
      element?.tagName === 'P' && /kierony.*owes.*szerszenie.*50\.00/i.test(element.textContent ?? ''),
    )
    expect(verdict).toBeInTheDocument()
  })

  it('shows even message when totals match', () => {
    render(
      <Scoreboard
        teamAName="Szerszenie"
        teamBName="Kierony"
        expenses={[makeExpense('a', 100), makeExpense('b', 100)]}
        activeTeam="a"
        onTeamSelect={() => {}}
      />,
    )
    expect(screen.getByText(/even/i)).toBeInTheDocument()
  })
})
