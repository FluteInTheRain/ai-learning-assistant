import { Link } from 'react-router-dom'
import type { SessionResponse } from '../api/types'
import { formatDate } from '../lib/formatDate'

interface SessionCardProps {
  session: SessionResponse
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Link to={`/sessions/${session.id}`} className="card session-card">
      <h3>{session.name}</h3>
      <p className="card__meta">Created {formatDate(session.created_at)}</p>
    </Link>
  )
}
