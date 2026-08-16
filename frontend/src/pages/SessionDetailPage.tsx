import { useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { DocumentCard } from '../components/DocumentCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { UploadForm } from '../components/UploadForm'
import { useDocuments, useUploadDocument } from '../hooks/useDocuments'
import { useSession } from '../hooks/useSession'
import { getErrorMessage } from '../lib/errorMessage'

export function SessionDetailPage() {
  const params = useParams<{ sessionId: string }>()
  const sessionId = Number(params.sessionId)

  const sessionQuery = useSession(sessionId)
  const documentsQuery = useDocuments(sessionId)
  const uploadDocument = useUploadDocument(sessionId)

  if (sessionQuery.isLoading) {
    return <LoadingSpinner />
  }

  if (sessionQuery.isError) {
    const isNotFound =
      sessionQuery.error instanceof ApiError && sessionQuery.error.status === 404
    if (isNotFound) {
      return (
        <div className="page">
          <EmptyState message="Session not found." />
        </div>
      )
    }
    return (
      <div className="page">
        <ErrorBanner
          message={getErrorMessage(sessionQuery.error)}
          onRetry={() => void sessionQuery.refetch()}
        />
      </div>
    )
  }

  const session = sessionQuery.data
  if (!session) {
    return <LoadingSpinner />
  }

  return (
    <div className="page">
      <h1>{session.name}</h1>

      <UploadForm
        onUpload={(file) => uploadDocument.mutate(file)}
        isPending={uploadDocument.isPending}
        errorMessage={
          uploadDocument.isError ? getErrorMessage(uploadDocument.error) : null
        }
      />

      <h2>Documents</h2>
      {documentsQuery.isLoading && <LoadingSpinner />}
      {documentsQuery.isError && (
        <ErrorBanner
          message={getErrorMessage(documentsQuery.error)}
          onRetry={() => void documentsQuery.refetch()}
        />
      )}
      {documentsQuery.isSuccess && documentsQuery.data.length === 0 && (
        <EmptyState message="No documents uploaded yet." />
      )}
      {documentsQuery.isSuccess && documentsQuery.data.length > 0 && (
        <div className="card-list">
          {documentsQuery.data.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  )
}
