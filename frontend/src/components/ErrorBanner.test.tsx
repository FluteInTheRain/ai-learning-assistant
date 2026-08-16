import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBanner } from './ErrorBanner'

describe('ErrorBanner', () => {
  it('renders the error message', () => {
    render(<ErrorBanner message="Something failed" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something failed')
  })

  it('does not render a retry button when onRetry is not provided', () => {
    render(<ErrorBanner message="Something failed" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()
    render(<ErrorBanner message="Something failed" onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: /retry/i }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
