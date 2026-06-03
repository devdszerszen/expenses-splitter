import { createClient } from '@supabase/supabase-js'
import type { Room, Expense } from '../types'

export type Database = {
  public: {
    Tables: {
      rooms: { Row: Room; Insert: Omit<Room, 'id' | 'created_at'>; Update: Partial<Room> }
      expenses: { Row: Expense; Insert: Omit<Expense, 'id' | 'created_at'>; Update: never }
    }
  }
}

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient<Database>(url, key)
