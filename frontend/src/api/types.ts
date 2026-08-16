// Types mirroring app/schemas/*.py response/request shapes.
// Keep these in sync with the backend — this frontend is a pure API consumer,
// it does not redefine or duplicate backend business/validation logic.

export interface SessionCreate {
  name: string
}

export interface SessionResponse {
  id: number
  name: string
  created_at: string
}

export type DocumentStatus = 'PENDING' | 'READY' | 'FAILED'

export interface DocumentResponse {
  id: number
  session_id: number
  filename: string
  file_type: string
  status: string
  created_at: string
}

export type GenerateAction = 'summary' | 'quiz'

export interface GenerateActionRequest {
  action: GenerateAction
}

export interface GeneratedContentResponse {
  id: number
  document_id: number
  action_type: string
  content: string
  created_at: string
}

// Shape of the JSON stored in GeneratedContentResponse.content when
// action_type === "quiz" (backend's Structured Outputs schema).
export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer_index: number
  explanation: string
}

export interface QuizContent {
  questions: QuizQuestion[]
}
