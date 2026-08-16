import { describe, expect, it } from 'vitest'
import type { DocumentResponse } from '../api/types'
import { documentPollInterval, documentsPollInterval } from './polling'

function makeDocument(status: string): DocumentResponse {
  return {
    id: 1,
    session_id: 1,
    filename: 'notes.pdf',
    file_type: 'pdf',
    status,
    created_at: '2026-01-01T00:00:00Z',
  }
}

describe('documentPollInterval', () => {
  it('returns 2000 when the document is PENDING', () => {
    expect(documentPollInterval(makeDocument('PENDING'))).toBe(2000)
  })

  it('returns false when the document is READY', () => {
    expect(documentPollInterval(makeDocument('READY'))).toBe(false)
  })

  it('returns false when the document is undefined', () => {
    expect(documentPollInterval(undefined)).toBe(false)
  })
})

describe('documentsPollInterval', () => {
  it('returns 2000 when any document is PENDING', () => {
    const docs = [makeDocument('READY'), makeDocument('PENDING')]
    expect(documentsPollInterval(docs)).toBe(2000)
  })

  it('returns false when no document is PENDING', () => {
    const docs = [makeDocument('READY'), makeDocument('FAILED')]
    expect(documentsPollInterval(docs)).toBe(false)
  })

  it('returns false when docs is undefined', () => {
    expect(documentsPollInterval(undefined)).toBe(false)
  })

  it('returns false for an empty list', () => {
    expect(documentsPollInterval([])).toBe(false)
  })
})
