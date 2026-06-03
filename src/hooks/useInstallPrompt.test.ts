import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInstallPrompt, dismissInstallPrompt, DISMISSED_KEY } from './useInstallPrompt'

const localStorageStore = new Map<string, string>()
const localStorageMock = {
  getItem: (k: string) => localStorageStore.get(k) ?? null,
  setItem: (k: string, v: string) => { localStorageStore.set(k, v) },
  removeItem: (k: string) => { localStorageStore.delete(k) },
  clear: () => { localStorageStore.clear() },
}
vi.stubGlobal('localStorage', localStorageMock)

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches }),
  })
}

function mockUserAgent(ua: string) {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    configurable: true,
    value: ua,
  })
}

beforeEach(() => {
  localStorageStore.clear()
  mockMatchMedia(false)
  mockUserAgent('Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/99')
  Object.defineProperty(navigator, 'standalone', {
    writable: true,
    configurable: true,
    value: undefined,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorageStore.clear()
})

describe('useInstallPrompt', () => {
  it('returns none when already in standalone mode (matchMedia)', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.type).toBe('none')
  })

  it('returns none when navigator.standalone is true (iOS PWA)', () => {
    Object.defineProperty(navigator, 'standalone', {
      writable: true,
      configurable: true,
      value: true,
    })
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.type).toBe('none')
  })

  it('returns none when banner was previously dismissed', () => {
    localStorage.setItem(DISMISSED_KEY, '1')
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.type).toBe('none')
  })

  it('returns android when beforeinstallprompt fires', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => {
      const e = new Event('beforeinstallprompt')
      ;(e as any).prompt = vi.fn().mockResolvedValue(undefined)
      ;(e as any).userChoice = Promise.resolve({ outcome: 'accepted' })
      window.dispatchEvent(e)
    })
    expect(result.current.type).toBe('android')
  })

  it('returns ios for iOS Safari', () => {
    mockUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    )
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.type).toBe('ios')
  })

  it('does not return ios for Chrome on iOS (CriOS)', () => {
    mockUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/99.0.4844.59 Mobile/15E148 Safari/604.1'
    )
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.type).toBe('none')
  })

  it('does not return ios for Firefox on iOS (FxiOS)', () => {
    mockUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/99.0 Mobile/15E148 Safari/604.1'
    )
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.type).toBe('none')
  })
})

describe('dismissInstallPrompt', () => {
  it('sets the dismissed key in localStorage', () => {
    dismissInstallPrompt()
    expect(localStorage.getItem(DISMISSED_KEY)).toBe('1')
  })
})
