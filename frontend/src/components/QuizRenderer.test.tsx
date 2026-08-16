import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { QuizRenderer } from './QuizRenderer'

const validQuiz = JSON.stringify({
  questions: [
    {
      question: 'What is the capital of France?',
      options: ['Berlin', 'Paris', 'Rome', 'Madrid'],
      correct_answer_index: 1,
      explanation: 'Paris is the capital of France.',
    },
    {
      question: 'What is 2 + 2?',
      options: ['3', '4'],
      correct_answer_index: 1,
      explanation: 'Basic arithmetic.',
    },
  ],
})

describe('QuizRenderer', () => {
  it('renders every question', () => {
    render(<QuizRenderer content={validQuiz} />)

    expect(
      screen.getByText('What is the capital of France?'),
    ).toBeInTheDocument()
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('marks the correct answer for each question', () => {
    render(<QuizRenderer content={validQuiz} />)

    const correctOptions = screen.getAllByText(/\(correct\)/)
    expect(correctOptions).toHaveLength(2)
  })

  it('falls back to raw content when it cannot be parsed', () => {
    render(<QuizRenderer content="not valid json" />)

    expect(screen.getByText('not valid json')).toBeInTheDocument()
  })
})
