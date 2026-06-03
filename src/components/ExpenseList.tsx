import type { Expense } from '../types'

interface Props {
  expenses: Expense[]
  teamAName: string
  teamBName: string
  onDelete: (id: string) => void
}

function fmt(n: number) {
  return Number(n).toFixed(2) + ' zł'
}

export default function ExpenseList({ expenses, teamAName, teamBName, onDelete }: Props) {
  if (!expenses.length) {
    return (
      <p className="text-center text-gray-500 py-10 font-body">No expenses yet. Add one!</p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {expenses.map((e) => {
        const isA = e.team === 'a'
        const teamName = isA ? teamAName : teamBName
        const accent = isA ? 'text-team-a border-team-a/30' : 'text-team-b border-team-b/30'
        return (
          <li
            key={e.id}
            className={`flex items-center justify-between gap-3 rounded-xl bg-[#1a1000] border px-4 py-3 ${accent}`}
          >
            <div className="flex flex-col min-w-0">
              <span className="font-body text-sm text-gray-300 truncate">{e.description}</span>
              <span className={`font-heading text-xs uppercase ${accent}`}>{teamName}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-heading text-xl">{fmt(e.amount)}</span>
              <button
                onClick={() => onDelete(e.id)}
                aria-label="Delete expense"
                className="text-gray-600 hover:text-team-b transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
