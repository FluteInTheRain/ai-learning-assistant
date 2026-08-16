import { Link } from 'react-router-dom'
import type { DocumentResponse } from '../api/types'
import { formatDate } from '../lib/formatDate'
import { StatusBadge } from './StatusBadge'

interface DocumentCardProps {
  document: DocumentResponse
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link to={`/documents/${document.id}`} className="card document-card">
      <h3>{document.filename}</h3>
      <StatusBadge status={document.status} />
      <p className="card__meta">Uploaded {formatDate(document.created_at)}</p>
    </Link>
  )
}
