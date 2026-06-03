export type SyncState = 'synced' | 'saving' | 'error'

interface Props {
  state: SyncState
}

const config: Record<SyncState, { color: string; label: string }> = {
  synced: { color: 'bg-even', label: 'Synced' },
  saving: { color: 'bg-team-a animate-pulse', label: 'Saving…' },
  error: { color: 'bg-team-b', label: 'Sync error' },
}

export default function SyncStatus({ state }: Props) {
  const { color, label } = config[state]
  return (
    <div className="flex items-center gap-1.5" title={label}>
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-gray-500 font-body">{label}</span>
    </div>
  )
}
