import type { ToastMessage } from '../hooks/useToast'

interface Props {
  toasts: ToastMessage[]
}

const variantClass: Record<string, string> = {
  success: 'border-even text-even',
  error: 'border-team-b text-team-b',
  info: 'border-team-a text-team-a',
}

export default function Toast({ toasts }: Props) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 w-[90vw] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border px-4 py-3 text-sm font-body bg-[#1a1000] shadow-lg ${variantClass[t.variant]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
