import { useState, useCallback } from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  message: string
  variant: ToastVariant
}

let counter = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++counter
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  return { toasts, addToast }
}
