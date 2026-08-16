interface SummaryRendererProps {
  content: string
}

export function SummaryRenderer({ content }: SummaryRendererProps) {
  return <p className="summary-renderer">{content}</p>
}
