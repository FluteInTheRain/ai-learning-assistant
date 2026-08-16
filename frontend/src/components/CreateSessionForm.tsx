import { useState } from 'react'
import type { FormEvent } from 'react'
import { ErrorBanner } from './ErrorBanner'

interface CreateSessionFormProps {
  onCreate: (name: string) => void
  isPending: boolean
  errorMessage: string | null
}

export function CreateSessionForm({
  onCreate,
  isPending,
  errorMessage,
}: CreateSessionFormProps) {
  const [name, setName] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="create-session-form">
      <label htmlFor="session-name">Session name</label>
      <input
        id="session-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Biology 101"
        disabled={isPending}
        required
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create session'}
      </button>
      {errorMessage && <ErrorBanner message={errorMessage} />}
    </form>
  )
}
