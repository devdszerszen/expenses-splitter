import { useState, useEffect } from 'react'
import type { Team } from '../types'
import { t } from '../i18n'

interface SubmitData {
  team: Team
  amount: number
  description: string
}

interface Props {
  open: boolean
  initialTeam: Team
  teamAName: string
  teamBName: string
  onSubmit: (data: SubmitData) => void
  onClose: () => void
}

export default function AddExpenseModal({ open, initialTeam, teamAName, teamBName, onSubmit, onClose }: Props) {
  const [team, setTeam] = useState<Team>(initialTeam)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) { setTeam(initialTeam); setAmount(''); setDescription('') }
  }, [open, initialTeam])

  if (!open) return null

  const parsedAmount = parseFloat(amount)
  const valid = !isNaN(parsedAmount) && parsedAmount > 0 && description.trim().length > 0

  function handleSubmit() {
    if (!valid) return
    onSubmit({ team, amount: parsedAmount, description: description.trim() })
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm bg-[#1a1000] rounded-2xl p-6 flex flex-col gap-5 border border-gray-800">
        <h2 className="font-heading text-3xl uppercase tracking-wide">{t.modal.title}</h2>

        <div className="flex gap-2">
          {(['a', 'b'] as Team[]).map((t) => {
            const name = t === 'a' ? teamAName : teamBName
            const activeClass = t === 'a'
              ? 'ring-2 ring-team-a text-team-a'
              : 'ring-2 ring-team-b text-team-b'
            return (
              <button
                key={t}
                onClick={() => setTeam(t)}
                className={`flex-1 rounded-xl py-2 font-heading text-lg uppercase border border-gray-700 transition-all ${team === t ? activeClass : 'text-gray-500'}`}
              >
                {name}
              </button>
            )
          })}
        </div>

        <input
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-4 font-heading text-4xl text-center text-white placeholder-gray-700 border border-gray-800 focus:outline-none focus:border-team-a"
        />

        <input
          type="text"
          placeholder={t.modal.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-3 font-body text-base text-white placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-heading text-lg uppercase"
          >
            {t.modal.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!valid}
            className="flex-1 py-3 rounded-xl bg-team-a text-black font-heading text-lg uppercase disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t.modal.add}
          </button>
        </div>
      </div>
    </div>
  )
}
