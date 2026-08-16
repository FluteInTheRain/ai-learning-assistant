import type { GeneratedContentResponse } from '../api/types'
import { formatDate } from '../lib/formatDate'
import { QuizRenderer } from './QuizRenderer'
import { SummaryRenderer } from './SummaryRenderer'

interface GeneratedContentCardProps {
  generated: GeneratedContentResponse
}

export function GeneratedContentCard({ generated }: GeneratedContentCardProps) {
  return (
    <article className="card generated-content-card">
      <header>
        <h4>{generated.action_type}</h4>
        <span className="card__meta">{formatDate(generated.created_at)}</span>
      </header>
      {generated.action_type === 'summary' && (
        <SummaryRenderer content={generated.content} />
      )}
      {generated.action_type === 'quiz' && (
        <QuizRenderer content={generated.content} />
      )}
      {generated.action_type !== 'summary' && generated.action_type !== 'quiz' && (
        <pre>{generated.content}</pre>
      )}
    </article>
  )
}
