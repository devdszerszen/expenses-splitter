import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ExpenseList from './ExpenseList'
import type { Expense } from '../types'

const expense: Expense = {
  id: 'e1',
  room_id: 'r1',
  team: 'a',
  description: 'Fuel stop',
  amount: 80,
  created_at: '2024-06-01T10:00:00Z',
}

describe('ExpenseList', () => {
  it('renders expense description and amount', () => {
    render(<ExpenseList expenses={[expense]} teamAName="Szerszenie" teamBName="Kierony" onDelete={vi.fn()} />)
    expect(screen.getByText('Fuel stop')).toBeInTheDocument()
    expect(screen.getByText('80.00 zł')).toBeInTheDocument()
    expect(screen.getByText('Szerszenie')).toBeInTheDocument()
  })

  it('calls onDelete with expense id when delete pressed', () => {
    const onDelete = vi.fn()
    render(<ExpenseList expenses={[expense]} teamAName="Szerszenie" teamBName="Kierony" onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith('e1')
  })

  it('shows empty state when no expenses', () => {
    render(<ExpenseList expenses={[]} teamAName="A" teamBName="B" onDelete={vi.fn()} />)
    expect(screen.getByText(/no expenses/i)).toBeInTheDocument()
  })
})
