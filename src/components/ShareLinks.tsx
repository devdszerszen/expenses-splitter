import { useState } from 'react'
import type { Team } from '../types'

interface Props {
  roomId: string
  teamAName: string
  teamBName: string
}

export default function ShareLinks({ roomId, teamAName, teamBName }: Props) {
  const [copied, setCopied] = useState<Team | null>(null)
  const base = window.location.origin

  async function copy(team: Team) {
    const url = `${base}/room/${roomId}?team=${team}`
    await navigator.clipboard.writeText(url)
    setCopied(team)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-heading text-sm uppercase tracking-widest text-gray-500">Share</p>
      <div className="flex gap-2">
        {(['a', 'b'] as Team[]).map((t) => {
          const name = t === 'a' ? teamAName : teamBName
          const accent = t === 'a' ? 'border-team-a text-team-a' : 'border-team-b text-team-b'
          const isCopied = copied === t
          return (
            <button
              key={t}
              onClick={() => copy(t)}
              className={`flex-1 py-2 rounded-xl border font-heading text-sm uppercase tracking-wide transition-all ${accent} ${isCopied ? 'opacity-60' : ''}`}
            >
              {isCopied ? 'Copied!' : `📋 ${name}`}
            </button>
          )
        })}
      </div>
    </div>
  )
}
