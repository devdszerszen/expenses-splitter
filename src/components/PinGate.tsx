import { useState } from 'react'
import { hashPin } from '../lib/hash'

interface Props {
  expectedHash: string
  onUnlock: () => void
}

export default function PinGate({ expectedHash, onUnlock }: Props) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  async function verify() {
    setChecking(true)
    const hash = await hashPin(pin)
    if (hash === expectedHash) {
      onUnlock()
    } else {
      setError(true)
      setPin('')
    }
    setChecking(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-6 px-4">
      <h1 className="font-heading text-4xl text-team-a uppercase">Enter PIN</h1>
      <input
        type="password"
        inputMode="numeric"
        value={pin}
        onChange={(e) => { setPin(e.target.value); setError(false) }}
        onKeyDown={(e) => e.key === 'Enter' && verify()}
        maxLength={8}
        className="w-48 text-center bg-[#1a1000] rounded-xl px-4 py-4 font-heading text-3xl tracking-[0.5em] border border-gray-700 focus:outline-none focus:border-team-a text-white"
        placeholder="••••"
      />
      {error && <p className="text-team-b font-body text-sm">Wrong PIN. Try again.</p>}
      <button
        onClick={verify}
        disabled={!pin || checking}
        className="px-8 py-3 rounded-xl bg-team-a text-black font-heading text-xl uppercase disabled:opacity-30"
      >
        Enter
      </button>
    </div>
  )
}
