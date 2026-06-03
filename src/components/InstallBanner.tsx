import { t } from '../i18n'

interface Props {
  type: 'android' | 'ios'
  onInstall?: () => void
  onDismiss: () => void
}

export default function InstallBanner({ type, onInstall, onDismiss }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-gray-900 border-t border-gray-700 px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200">{t.install.prompt}</p>
        {type === 'ios' && (
          <p className="text-xs text-gray-400 mt-0.5">{t.install.iosInstructions}</p>
        )}
      </div>
      {type === 'android' && onInstall && (
        <button
          onClick={onInstall}
          className="text-team-a font-heading text-sm uppercase tracking-wide shrink-0"
        >
          {t.install.install}
        </button>
      )}
      <button
        onClick={onDismiss}
        aria-label={t.install.dismiss}
        className="text-gray-500 hover:text-gray-300 shrink-0 text-lg leading-none"
      >
        ✕
      </button>
    </div>
  )
}
