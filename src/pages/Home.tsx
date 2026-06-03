import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { hashPin } from '../lib/hash'

const QUICK_START = {
  name: 'Wyjazd',
  teamA: 'Szerszenie 🐝',
  teamB: 'Kierony 🚗',
}

export default function Home() {
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [pin, setPin] = useState('')
  const [joinId, setJoinId] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  function applyQuickStart() {
    setRoomName(QUICK_START.name)
    setTeamA(QUICK_START.teamA)
    setTeamB(QUICK_START.teamB)
  }

  async function createRoom() {
    setError('')
    if (!roomName.trim() || !teamA.trim() || !teamB.trim()) {
      setError('Please fill in room name and both team names.')
      return
    }
    setCreating(true)
    const pin_hash = pin ? await hashPin(pin) : null
    const { data, error: dbError } = await supabase
      .from('rooms')
      .insert({ name: roomName.trim(), team_a_name: teamA.trim(), team_b_name: teamB.trim(), pin_hash } as Record<string, unknown>)
      .select('id')
      .single()
    setCreating(false)
    if (dbError || !data) { setError('Failed to create room. Check your connection.'); return }
    navigate(`/room/${(data as { id: string }).id}`)
  }

  function joinRoom() {
    const trimmed = joinId.trim()
    if (!trimmed) return
    const match = trimmed.match(/[0-9a-f-]{36}/)
    if (match) navigate(`/room/${match[0]}`)
    else setError('Invalid room link or ID.')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-10 gap-8 max-w-sm mx-auto">
      <div className="text-center">
        <h1 className="font-heading text-6xl uppercase text-team-a tracking-tight">Trip Splitter</h1>
        <p className="font-body text-gray-500 mt-1">Split expenses, keep friends.</p>
      </div>

      <div className="w-full flex flex-col gap-3 bg-[#1a1000] rounded-2xl p-5 border border-gray-800">
        <h2 className="font-heading text-2xl uppercase text-gray-300">New Room</h2>

        <button
          onClick={applyQuickStart}
          className="text-left text-xs text-team-a font-body underline"
        >
          ⚡ Quick Start: Szerszenie vs Kierony
        </button>

        <input
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-white placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
        />
        <div className="flex gap-2">
          <input
            placeholder="Team A name"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="flex-1 bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-team-a placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
          />
          <input
            placeholder="Team B name"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="flex-1 bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-team-b placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-b"
          />
        </div>
        <input
          type="password"
          placeholder="PIN (optional)"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={8}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-white placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
        />
        <button
          onClick={createRoom}
          disabled={creating}
          className="w-full py-3 rounded-xl bg-team-a text-black font-heading text-xl uppercase disabled:opacity-40"
        >
          {creating ? 'Creating…' : 'Create Room'}
        </button>
      </div>

      <div className="w-full flex flex-col gap-3 bg-[#1a1000] rounded-2xl p-5 border border-gray-800">
        <h2 className="font-heading text-2xl uppercase text-gray-300">Join Room</h2>
        <input
          placeholder="Paste room link or ID"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-white placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
        />
        <button
          onClick={joinRoom}
          className="w-full py-3 rounded-xl border border-team-a text-team-a font-heading text-xl uppercase"
        >
          Join
        </button>
      </div>

      {error && <p className="text-team-b font-body text-sm text-center">{error}</p>}
    </div>
  )
}
