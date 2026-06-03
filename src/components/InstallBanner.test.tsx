import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import InstallBanner from './InstallBanner'

describe('InstallBanner', () => {
  it('shows prompt text for android with install button', () => {
    render(<InstallBanner type="android" onInstall={vi.fn()} onDismiss={vi.fn()} />)
    expect(screen.getByText(/Add to your home screen/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /install/i })).toBeInTheDocument()
  })

  it('shows prompt text and instructions for ios without install button', () => {
    render(<InstallBanner type="ios" onDismiss={vi.fn()} />)
    expect(screen.getByText(/Add to your home screen/i)).toBeInTheDocument()
    expect(screen.getByText(/Tap Share/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /install/i })).not.toBeInTheDocument()
  })

  it('calls onInstall when install button clicked', () => {
    const onInstall = vi.fn()
    render(<InstallBanner type="android" onInstall={onInstall} onDismiss={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /install/i }))
    expect(onInstall).toHaveBeenCalledOnce()
  })

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn()
    render(<InstallBanner type="android" onInstall={vi.fn()} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('calls onDismiss on ios when dismiss clicked', () => {
    const onDismiss = vi.fn()
    render(<InstallBanner type="ios" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
