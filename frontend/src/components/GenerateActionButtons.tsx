import type { GenerateAction } from '../api/types'

interface GenerateActionButtonsProps {
  disabled: boolean
  isPending: boolean
  onGenerate: (action: GenerateAction) => void
}

export function GenerateActionButtons({
  disabled,
  isPending,
  onGenerate,
}: GenerateActionButtonsProps) {
  return (
    <div className="generate-action-buttons">
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => onGenerate('summary')}
      >
        Summarize
      </button>
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => onGenerate('quiz')}
      >
        Generate quiz questions
      </button>
    </div>
  )
}
