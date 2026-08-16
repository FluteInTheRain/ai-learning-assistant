import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateContent, uploadDocument } from './documents'

describe('uploadDocument', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the file as FormData, not JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          session_id: 1,
          filename: 'notes.pdf',
          file_type: 'pdf',
          status: 'READY',
          created_at: '2026-01-01T00:00:00Z',
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const file = new File([new Uint8Array([1, 2, 3])], 'notes.pdf', {
      type: 'application/pdf',
    })
    await uploadDocument(1, file)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/sessions/1/documents')
    expect(init.body).toBeInstanceOf(FormData)
    const headers = new Headers(init.headers)
    expect(headers.get('Content-Type')).toBeNull()
  })
})

describe('generateContent', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends a JSON body with the requested action', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          document_id: 5,
          action_type: 'summary',
          content: 'A summary.',
          created_at: '2026-01-01T00:00:00Z',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await generateContent(5, 'summary')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/documents/5/generate')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ action: 'summary' }))
    const headers = new Headers(init.headers)
    expect(headers.get('Content-Type')).toBe('application/json')
  })
})
