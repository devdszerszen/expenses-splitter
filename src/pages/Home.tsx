import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { hashPin } from '../lib/hash'
import { t } from '../i18n'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)lastRoomId=([^;]+)/)
    if (match) navigate(`/room/${match[1]}`, { replace: true })
  }, [navigate])
  const [roomName, setRoomName] = useState('')
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [pin, setPin] = useState('')
  const [joinId, setJoinId] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function createRoom() {
    setError('')
    if (!roomName.trim() || !teamA.trim() || !teamB.trim()) {
      setError(t.home.errorFillFields)
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
    if (dbError || !data) { setError(t.home.errorCreate); return }
    navigate(`/room/${(data as { id: string }).id}`)
  }

  function joinRoom() {
    const trimmed = joinId.trim()
    if (!trimmed) return
    const match = trimmed.match(/[0-9a-f-]{36}/)
    if (match) navigate(`/room/${match[0]}`)
    else setError(t.home.errorInvalidId)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-10 gap-8 max-w-sm mx-auto">
      <div className="text-center">
        <h1 className="font-heading text-6xl uppercase text-team-a tracking-tight">{t.home.title}</h1>
        <p className="font-body text-gray-500 mt-1">{t.home.tagline}</p>
      </div>

      <div className="w-full flex flex-col gap-3 bg-[#1a1000] rounded-2xl p-5 border border-gray-800">
        <h2 className="font-heading text-2xl uppercase text-gray-300">{t.home.newRoom}</h2>

        <input
          placeholder={t.home.roomName}
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-white placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
        />
        <input
          placeholder={t.home.teamAName}
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-team-a placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
        />
        <input
          placeholder={t.home.teamBName}
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-team-b placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-b"
        />
        <input
          type="password"
          placeholder={t.home.pin}
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
          {creating ? t.home.creating : t.home.createRoom}
        </button>
      </div>

      <div className="w-full flex flex-col gap-3 bg-[#1a1000] rounded-2xl p-5 border border-gray-800">
        <h2 className="font-heading text-2xl uppercase text-gray-300">{t.home.joinRoom}</h2>
        <input
          placeholder={t.home.joinPlaceholder}
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          className="w-full bg-[#0f0800] rounded-xl px-4 py-2.5 font-body text-white placeholder-gray-600 border border-gray-800 focus:outline-none focus:border-team-a"
        />
        <button
          onClick={joinRoom}
          className="w-full py-3 rounded-xl border border-team-a text-team-a font-heading text-xl uppercase"
        >
          {t.home.join}
        </button>
      </div>

      {error && <p className="text-team-b font-body text-sm text-center">{error}</p>}
    </div>
  )
}
