import { ApiError } from '../api/client'

/** Map any thrown error into a human-readable message for display. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.detail
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}
