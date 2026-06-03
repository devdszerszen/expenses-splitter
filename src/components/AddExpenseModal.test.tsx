import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AddExpenseModal from './AddExpenseModal'

describe('AddExpenseModal', () => {
  it('renders with correct team pre-selected', () => {
    render(
      <AddExpenseModal
        open={true}
        initialTeam="a"
        teamAName="Szerszenie"
        teamBName="Kierony"
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /szerszenie/i })).toHaveClass('ring-2')
  })

  it('submit button disabled when fields empty', () => {
    render(
      <AddExpenseModal
        open={true}
        initialTeam="a"
        teamAName="A"
        teamBName="B"
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /add expense/i })).toBeDisabled()
  })

  it('calls onSubmit with correct data', () => {
    const onSubmit = vi.fn()
    render(
      <AddExpenseModal
        open={true}
        initialTeam="b"
        teamAName="A"
        teamBName="B"
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByPlaceholderText(/0.00/i), { target: { value: '42.5' } })
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Lunch' } })
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }))
    expect(onSubmit).toHaveBeenCalledWith({ team: 'b', amount: 42.5, description: 'Lunch' })
  })
})
