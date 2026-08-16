import { parseQuizContent } from '../lib/quiz'

interface QuizRendererProps {
  content: string
}

export function QuizRenderer({ content }: QuizRendererProps) {
  const quiz = parseQuizContent(content)

  if (!quiz) {
    return <pre className="quiz-renderer__fallback">{content}</pre>
  }

  return (
    <ol className="quiz-renderer">
      {quiz.questions.map((q, questionIndex) => (
        <li key={questionIndex} className="quiz-renderer__question">
          <p className="quiz-renderer__question-text">{q.question}</p>
          <ul className="quiz-renderer__options">
            {q.options.map((option, optionIndex) => (
              <li
                key={optionIndex}
                className={
                  optionIndex === q.correct_answer_index
                    ? 'quiz-renderer__option quiz-renderer__option--correct'
                    : 'quiz-renderer__option'
                }
              >
                {option}
                {optionIndex === q.correct_answer_index && (
                  <span className="quiz-renderer__correct-marker"> (correct)</span>
                )}
              </li>
            ))}
          </ul>
          <p className="quiz-renderer__explanation">{q.explanation}</p>
        </li>
      ))}
    </ol>
  )
}
