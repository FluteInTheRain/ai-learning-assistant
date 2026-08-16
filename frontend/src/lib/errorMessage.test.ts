import { describe, expect, it } from 'vitest'
import { ApiError } from '../api/client'
import { getErrorMessage } from './errorMessage'

describe('getErrorMessage', () => {
  it('returns the detail from an ApiError', () => {
    const error = new ApiError(400, 'Unsupported file type')
    expect(getErrorMessage(error)).toBe('Unsupported file type')
  })

  it('returns the message from a generic Error', () => {
    const error = new Error('Network request failed')
    expect(getErrorMessage(error)).toBe('Network request failed')
  })

  it('returns a fallback message for a non-Error value', () => {
    expect(getErrorMessage('some string')).toBe(
      'Something went wrong. Please try again.',
    )
    expect(getErrorMessage(undefined)).toBe(
      'Something went wrong. Please try again.',
    )
  })
})
