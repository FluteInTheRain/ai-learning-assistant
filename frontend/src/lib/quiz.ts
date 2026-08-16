import type { QuizContent, QuizQuestion } from '../api/types'

function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (typeof value !== 'object' || value === null) return false
  const q = value as Record<string, unknown>
  return (
    typeof q.question === 'string' &&
    Array.isArray(q.options) &&
    q.options.every((o) => typeof o === 'string') &&
    typeof q.correct_answer_index === 'number' &&
    typeof q.explanation === 'string'
  )
}

/**
 * Safely parse a generated_contents.content string for a "quiz" action into
 * its structured shape. Returns null (never throws) if the content isn't
 * valid JSON or doesn't match the expected quiz shape.
 */
export function parseQuizContent(content: string): QuizContent | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return null
  }

  if (typeof parsed !== 'object' || parsed === null) return null
  const candidate = parsed as Record<string, unknown>
  if (!Array.isArray(candidate.questions)) return null
  if (!candidate.questions.every(isQuizQuestion)) return null

  return { questions: candidate.questions }
}
