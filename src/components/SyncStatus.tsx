import { t } from '../i18n'

export type SyncState = 'synced' | 'saving' | 'error'

interface Props {
  state: SyncState
}

const colors: Record<SyncState, string> = {
  synced: 'bg-even',
  saving: 'bg-team-a animate-pulse',
  error: 'bg-team-b',
}

export default function SyncStatus({ state }: Props) {
  const color = colors[state]
  const label = t.sync[state]
  return (
    <div className="flex items-center gap-1.5" title={label}>
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-gray-500 font-body">{label}</span>
    </div>
  )
}
