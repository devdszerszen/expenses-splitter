import type { Expense } from '../types'
import { calculateSettlement } from '../lib/settlement'
import { t } from '../i18n'

interface Props {
  teamAName: string
  teamBName: string
  expenses: Expense[]
}

function fmt(n: number) {
  return n.toFixed(2) + ' zł'
}

export default function Scoreboard({ teamAName, teamBName, expenses }: Props) {
  const totalA = expenses.filter((e) => e.team === 'a').reduce((s, e) => s + Number(e.amount), 0)
  const totalB = expenses.filter((e) => e.team === 'b').reduce((s, e) => s + Number(e.amount), 0)
  const settlement = calculateSettlement(totalA, totalB)

  const teamName = (team: 'a' | 'b') => (team === 'a' ? teamAName : teamBName)

  return (
    <div className="bg-[#1a1000] rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <div className="flex-1 text-center">
          <div className="font-heading text-2xl text-team-a uppercase tracking-wide">{teamAName}</div>
          <div className="font-heading text-4xl text-team-a">{fmt(totalA)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="font-heading text-2xl text-team-b uppercase tracking-wide">{teamBName}</div>
          <div className="font-heading text-4xl text-team-b">{fmt(totalB)}</div>
        </div>
      </div>

      <div className="text-center rounded-xl py-3 bg-[#0f0800] border border-gray-800">
        {settlement.isEven ? (
          <p className="font-heading text-xl text-even uppercase tracking-widest">{t.scoreboard.even}</p>
        ) : (
          <p className="font-body text-sm text-gray-300">
            <span className={settlement.owingTeam === 'a' ? 'text-team-a' : 'text-team-b'}>
              {teamName(settlement.owingTeam!)}
            </span>
            {t.scoreboard.owes}
            <span className={settlement.owedTeam === 'a' ? 'text-team-a' : 'text-team-b'}>
              {teamName(settlement.owedTeam!)}
            </span>
            {' '}
            <span className="font-heading text-lg text-even">{fmt(settlement.amount)}</span>
          </p>
        )}
      </div>
    </div>
  )
}
