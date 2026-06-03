import { useState } from 'react'
import type { Team } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  roomId: string
  teamAName: string
  teamBName: string
}

export default function ShareLinks({ open, onClose, roomId, teamAName, teamBName }: Props) {
  const [copied, setCopied] = useState<Team | null>(null)
  const base = window.location.origin

  async function copy(team: Team) {
    const url = `${base}/room/${roomId}?team=${team}`
    await navigator.clipboard.writeText(url)
    setCopied(team)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-sm bg-[#1a1000] rounded-t-2xl p-6 flex flex-col gap-4 border-t border-x border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl uppercase tracking-wide text-gray-300">Share Room</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl leading-none">×</button>
        </div>

        <p className="font-body text-sm text-gray-500">Send the right link so each team lands on their view.</p>

        <div className="flex flex-col gap-3">
          {(['a', 'b'] as Team[]).map((t) => {
            const name = t === 'a' ? teamAName : teamBName
            const accent = t === 'a'
              ? 'border-team-a text-team-a'
              : 'border-team-b text-team-b'
            const isCopied = copied === t
            return (
              <button
                key={t}
                onClick={() => copy(t)}
                className={`w-full py-3 rounded-xl border font-heading text-lg uppercase tracking-wide transition-all ${accent} ${isCopied ? 'opacity-60' : ''}`}
              >
                {isCopied ? '✓ Copied!' : `📋 Copy link for ${name}`}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
