import { describe, expect, it } from 'vitest'
import { parseQuizContent } from './quiz'

describe('parseQuizContent', () => {
  it('parses a valid quiz payload', () => {
    const content = JSON.stringify({
      questions: [
        {
          question: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correct_answer_index: 1,
          explanation: 'Basic arithmetic.',
        },
      ],
    })

    const result = parseQuizContent(content)

    expect(result).toEqual({
      questions: [
        {
          question: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correct_answer_index: 1,
          explanation: 'Basic arithmetic.',
        },
      ],
    })
  })

  it('returns null for invalid JSON', () => {
    expect(parseQuizContent('not json')).toBeNull()
  })

  it('returns null when questions is missing', () => {
    expect(parseQuizContent(JSON.stringify({ foo: 'bar' }))).toBeNull()
  })

  it('returns null when questions is not an array', () => {
    expect(parseQuizContent(JSON.stringify({ questions: 'nope' }))).toBeNull()
  })

  it('returns null when a question is missing required fields', () => {
    const content = JSON.stringify({
      questions: [{ question: 'Missing fields' }],
    })
    expect(parseQuizContent(content)).toBeNull()
  })
})
