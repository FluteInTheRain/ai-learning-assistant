import { request } from './client'
import type {
  DocumentResponse,
  GenerateAction,
  GeneratedContentResponse,
} from './types'

export function listDocuments(sessionId: number): Promise<DocumentResponse[]> {
  return request<DocumentResponse[]>(`/sessions/${sessionId}/documents`)
}

export function getDocument(documentId: number): Promise<DocumentResponse> {
  return request<DocumentResponse>(`/documents/${documentId}`)
}

export function uploadDocument(
  sessionId: number,
  file: File,
): Promise<DocumentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return request<DocumentResponse>(`/sessions/${sessionId}/documents`, {
    method: 'POST',
    body: formData,
    isJsonBody: false,
  })
}

export function generateContent(
  documentId: number,
  action: GenerateAction,
): Promise<GeneratedContentResponse> {
  return request<GeneratedContentResponse>(`/documents/${documentId}/generate`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  })
}

export function listGeneratedContent(
  documentId: number,
): Promise<GeneratedContentResponse[]> {
  return request<GeneratedContentResponse[]>(`/documents/${documentId}/generated`)
}
