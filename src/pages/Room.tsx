import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useExpenses } from '../hooks/useExpenses'
import { useToast } from '../hooks/useToast'
import Scoreboard from '../components/Scoreboard'
import ExpenseList from '../components/ExpenseList'
import AddExpenseModal from '../components/AddExpenseModal'
import ShareLinks from '../components/ShareLinks'
import Toast from '../components/Toast'
import SyncStatus from '../components/SyncStatus'
import PinGate from '../components/PinGate'
import type { Team } from '../types'
import { t } from '../i18n'

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const roomState = useRoom(roomId)
  const { expenses, syncState, addExpense, deleteExpense } = useExpenses(roomId ?? '')
  const { toasts, addToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [pinUnlocked, setPinUnlocked] = useState(false)

  const urlTeam = searchParams.get('team') as Team | null
  const [activeTeam, setActiveTeam] = useState<Team>(urlTeam === 'b' ? 'b' : 'a')

  if (roomState.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="font-heading text-3xl text-gray-600 animate-pulse">{t.room.loading}</div>
      </div>
    )
  }

  if (roomState.status === 'not_found' || roomState.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-4">
        <h1 className="font-heading text-4xl text-team-b">{t.room.notFound}</h1>
        <button
          onClick={() => {
            if (roomState.status === 'not_found') document.cookie = 'lastRoomId=;path=/;max-age=0'
            navigate('/')
          }}
          className="text-team-a underline font-body"
        >
          {t.room.goHome}
        </button>
      </div>
    )
  }

  const { room } = roomState

  // Cookies are shared between Safari and the installed PWA on iOS; localStorage is not
  document.cookie = `lastRoomId=${room.id};path=/;max-age=31536000`

  if (room.pin_hash && !pinUnlocked) {
    return <PinGate expectedHash={room.pin_hash} onUnlock={() => setPinUnlocked(true)} />
  }

  async function handleAddExpense(data: { team: Team; amount: number; description: string }) {
    setModalOpen(false)
    const error = await addExpense({ room_id: roomId!, ...data })
    if (error) addToast(t.toast.addFail, 'error')
    else addToast(t.toast.addSuccess, 'success')
  }

  async function handleDelete(id: string) {
    const error = await deleteExpense(id)
    if (error) addToast(t.toast.deleteFail, 'error')
    else addToast(t.toast.deleteSuccess, 'info')
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-sm mx-auto px-4 py-6 gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-3xl uppercase text-white tracking-wide">{room.name}</h1>
          <button
            onClick={() => setShareOpen(true)}
            aria-label={t.room.shareAriaLabel}
            className="text-gray-500 hover:text-team-a transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
        <SyncStatus state={syncState} />
      </div>

      <Scoreboard
        teamAName={room.team_a_name}
        teamBName={room.team_b_name}
        expenses={expenses}
        activeTeam={activeTeam}
        onTeamSelect={setActiveTeam}
      />

      <div className="flex-1">
        <ExpenseList
          expenses={expenses}
          teamAName={room.team_a_name}
          teamBName={room.team_b_name}
          onDelete={handleDelete}
        />
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-team-a text-black font-heading text-4xl shadow-lg shadow-team-a/30 flex items-center justify-center z-30"
        aria-label={t.room.addAriaLabel}
      >
        +
      </button>

      <ShareLinks
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        roomId={room.id}
        teamAName={room.team_a_name}
        teamBName={room.team_b_name}
      />

      <AddExpenseModal
        open={modalOpen}
        initialTeam={activeTeam}
        teamAName={room.team_a_name}
        teamBName={room.team_b_name}
        onSubmit={handleAddExpense}
        onClose={() => setModalOpen(false)}
      />

      <Toast toasts={toasts} />
    </div>
  )
}
