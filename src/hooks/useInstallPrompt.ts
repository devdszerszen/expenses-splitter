import { useState, useEffect } from 'react'

export const DISMISSED_KEY = 'pwa-install-dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallState =
  | { type: 'none' }
  | { type: 'android'; prompt: () => void }
  | { type: 'ios' }

export function useInstallPrompt(): InstallState {
  const [state, setState] = useState<InstallState>({ type: 'none' })

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true

    if (isStandalone || localStorage.getItem(DISMISSED_KEY)) return

    const handler = (e: Event) => {
      e.preventDefault()
      const deferred = e as BeforeInstallPromptEvent
      setState({
        type: 'android',
        prompt: () => {
          deferred.prompt()
          setState({ type: 'none' })
        },
      })
    }
    window.addEventListener('beforeinstallprompt', handler)

    const ua = navigator.userAgent
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    const isIOSBrowser = /(CriOS|FxiOS|OPiOS)/i.test(ua)
    if (isIOS && !isIOSBrowser) {
      setState({ type: 'ios' })
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  return state
}

export function dismissInstallPrompt() {
  localStorage.setItem(DISMISSED_KEY, '1')
}
