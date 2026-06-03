import type { Expense } from '../types'
import { calculateSettlement } from '../lib/settlement'
import { t } from '../i18n'

interface Props {
  teamAName: string
  teamBName: string
  expenses: Expense[]
  activeTeam: 'a' | 'b'
  onTeamSelect: (team: 'a' | 'b') => void
}

function fmt(n: number) {
  return n.toFixed(2) + ' zł'
}

export default function Scoreboard({ teamAName, teamBName, expenses, activeTeam, onTeamSelect }: Props) {
  const totalA = expenses.filter((e) => e.team === 'a').reduce((s, e) => s + Number(e.amount), 0)
  const totalB = expenses.filter((e) => e.team === 'b').reduce((s, e) => s + Number(e.amount), 0)
  const settlement = calculateSettlement(totalA, totalB)

  const teamName = (team: 'a' | 'b') => (team === 'a' ? teamAName : teamBName)

  return (
    <div className="bg-[#1a1000] rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex justify-between gap-3">
        {(['a', 'b'] as const).map((team) => {
          const name = team === 'a' ? teamAName : teamBName
          const total = team === 'a' ? totalA : totalB
          const isActive = activeTeam === team
          const colorClass = team === 'a' ? 'text-team-a' : 'text-team-b'
          const borderActive = team === 'a'
            ? 'border-team-a shadow-[0_0_18px_rgba(255,183,0,0.35)]'
            : 'border-team-b shadow-[0_0_18px_rgba(255,60,31,0.35)]'
          return (
            <button
              key={team}
              onClick={() => onTeamSelect(team)}
              className={`flex-1 text-center rounded-xl px-3 py-2 border-2 transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? `${borderActive} scale-[1.03]`
                  : 'border-transparent opacity-40 hover:opacity-60'
              }`}
            >
              <div className={`font-heading text-2xl uppercase tracking-wide ${colorClass}`}>{name}</div>
              <div className={`font-heading text-4xl ${colorClass}`}>{fmt(total)}</div>
              <div className={`mt-1.5 flex justify-center ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${team === 'a' ? 'bg-team-a' : 'bg-team-b'}`} />
              </div>
            </button>
          )
        })}
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
