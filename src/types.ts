export type Team = 'a' | 'b'

export interface Room {
  id: string
  name: string
  team_a_name: string
  team_b_name: string
  pin_hash: string | null
  created_at: string
}

export interface Expense {
  id: string
  room_id: string
  team: Team
  description: string
  amount: number
  created_at: string
}

export interface Settlement {
  diff: number
  owingTeam: Team | null
  owedTeam: Team | null
  amount: number
  isEven: boolean
}
