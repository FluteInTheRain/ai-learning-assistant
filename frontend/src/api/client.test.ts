import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, request } from './client'

describe('request', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('parses a successful JSON response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 1, name: 'Session A' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await request<{ id: number; name: string }>('/sessions/1')

    expect(result).toEqual({ id: 1, name: 'Session A' })
  })

  it('throws ApiError with status and detail from the error body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Session not found' }), {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(request('/sessions/999')).rejects.toMatchObject({
      status: 404,
      detail: 'Session not found',
    })
  })

  it('is an instance of ApiError', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: 'boom' }), { status: 500 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(request('/sessions')).rejects.toBeInstanceOf(ApiError)
  })

  it('falls back to statusText when the error body is not JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('<html>not json</html>', {
        status: 502,
        statusText: 'Bad Gateway',
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(request('/documents/1/generate')).rejects.toMatchObject({
      status: 502,
      detail: 'Bad Gateway',
    })
  })
})
