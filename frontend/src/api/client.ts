const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/** Error shape returned by the backend on every failure: {"detail": "<message>"} */
interface ErrorBody {
  detail?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

async function parseErrorDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ErrorBody
    if (typeof body.detail === 'string' && body.detail.length > 0) {
      return body.detail
    }
  } catch {
    // Body wasn't JSON (or was empty) — fall through to statusText.
  }
  return response.statusText || `Request failed with status ${response.status}`
}

export interface RequestOptions {
  method?: string
  body?: BodyInit
  headers?: HeadersInit
  isJsonBody?: boolean
}

/**
 * Thin fetch wrapper. Parses successful JSON responses as T; throws ApiError
 * (with status + detail extracted from the {"detail": ...} body) on failure.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers, isJsonBody = true } = options

  const finalHeaders = new Headers(headers)
  if (isJsonBody && body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    body,
    headers: finalHeaders,
  })

  if (!response.ok) {
    const detail = await parseErrorDetail(response)
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
