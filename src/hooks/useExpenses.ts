import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Expense } from '../types'
import type { SyncState } from '../components/SyncStatus'

export function useExpenses(roomId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [syncState, setSyncState] = useState<SyncState>('synced')

  useEffect(() => {
    supabase
      .from('expenses')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setSyncState('error')
        else setExpenses(data ?? [])
      })

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setExpenses((prev) => [payload.new as Expense, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setExpenses((prev) => prev.filter((e) => e.id !== (payload.old as Expense).id))
          }
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  async function addExpense(expense: Omit<Expense, 'id' | 'created_at'>) {
    setSyncState('saving')
    const { error } = await supabase.from('expenses').insert(expense)
    setSyncState(error ? 'error' : 'synced')
    return error
  }

  async function deleteExpense(id: string) {
    setSyncState('saving')
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    setSyncState(error ? 'error' : 'synced')
    return error
  }

  return { expenses, syncState, addExpense, deleteExpense }
}
