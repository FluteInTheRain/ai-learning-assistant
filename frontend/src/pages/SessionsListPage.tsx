import { useNavigate } from 'react-router-dom'
import { CreateSessionForm } from '../components/CreateSessionForm'
import { EmptyState } from '../components/EmptyState'
import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { SessionCard } from '../components/SessionCard'
import { useCreateSession, useSessions } from '../hooks/useSessions'
import { getErrorMessage } from '../lib/errorMessage'

export function SessionsListPage() {
  const navigate = useNavigate()
  const sessionsQuery = useSessions()
  const createSession = useCreateSession()

  function handleCreate(name: string) {
    createSession.mutate(
      { name },
      {
        onSuccess: (session) => {
          navigate(`/sessions/${session.id}`)
        },
      },
    )
  }

  return (
    <div className="page">
      <h1>Sessions</h1>

      <CreateSessionForm
        onCreate={handleCreate}
        isPending={createSession.isPending}
        errorMessage={
          createSession.isError ? getErrorMessage(createSession.error) : null
        }
      />

      {sessionsQuery.isLoading && <LoadingSpinner />}
      {sessionsQuery.isError && (
        <ErrorBanner
          message={getErrorMessage(sessionsQuery.error)}
          onRetry={() => void sessionsQuery.refetch()}
        />
      )}
      {sessionsQuery.isSuccess && sessionsQuery.data.length === 0 && (
        <EmptyState message="No sessions yet. Create one to get started." />
      )}
      {sessionsQuery.isSuccess && sessionsQuery.data.length > 0 && (
        <div className="card-list">
          {sessionsQuery.data.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}
