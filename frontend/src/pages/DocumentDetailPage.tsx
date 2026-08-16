import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { EmptyState } from '../components/EmptyState'
import { ErrorBanner } from '../components/ErrorBanner'
import { GenerateActionButtons } from '../components/GenerateActionButtons'
import { GeneratedContentCard } from '../components/GeneratedContentCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { StatusBadge } from '../components/StatusBadge'
import { useDocument } from '../hooks/useDocument'
import {
  useGenerateContent,
  useGeneratedContent,
} from '../hooks/useGeneratedContent'
import { getErrorMessage } from '../lib/errorMessage'
import type { GenerateAction } from '../api/types'

export function DocumentDetailPage() {
  const params = useParams<{ documentId: string }>()
  const documentId = Number(params.documentId)

  const documentQuery = useDocument(documentId)
  const generatedQuery = useGeneratedContent(documentId)
  const generateContent = useGenerateContent(documentId)
  const [lastAction, setLastAction] = useState<GenerateAction | null>(null)

  if (documentQuery.isLoading) {
    return <LoadingSpinner />
  }

  if (documentQuery.isError) {
    const isNotFound =
      documentQuery.error instanceof ApiError && documentQuery.error.status === 404
    if (isNotFound) {
      return (
        <div className="page">
          <EmptyState message="Document not found." />
        </div>
      )
    }
    return (
      <div className="page">
        <ErrorBanner
          message={getErrorMessage(documentQuery.error)}
          onRetry={() => void documentQuery.refetch()}
        />
      </div>
    )
  }

  const document = documentQuery.data
  if (!document) {
    return <LoadingSpinner />
  }
  const isReady = document.status === 'READY'

  function handleGenerate(action: GenerateAction) {
    setLastAction(action)
    generateContent.mutate(action)
  }

  function handleRetry() {
    if (lastAction) {
      generateContent.mutate(lastAction)
    }
  }

  return (
    <div className="page">
      <h1>{document.filename}</h1>
      <StatusBadge status={document.status} />

      <GenerateActionButtons
        disabled={!isReady}
        isPending={generateContent.isPending}
        onGenerate={handleGenerate}
      />

      {generateContent.isError && (
        <ErrorBanner
          message={getErrorMessage(generateContent.error)}
          onRetry={handleRetry}
        />
      )}

      <h2>Generated content</h2>
      {generatedQuery.isLoading && <LoadingSpinner />}
      {generatedQuery.isError && (
        <ErrorBanner
          message={getErrorMessage(generatedQuery.error)}
          onRetry={() => void generatedQuery.refetch()}
        />
      )}
      {generatedQuery.isSuccess && generatedQuery.data.length === 0 && (
        <EmptyState message="Nothing generated yet." />
      )}
      {generatedQuery.isSuccess && generatedQuery.data.length > 0 && (
        <div className="card-list">
          {generatedQuery.data.map((generated) => (
            <GeneratedContentCard key={generated.id} generated={generated} />
          ))}
        </div>
      )}
    </div>
  )
}
