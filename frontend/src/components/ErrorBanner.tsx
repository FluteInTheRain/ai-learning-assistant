interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div role="alert" className="error-banner">
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="error-banner__retry">
          Retry
        </button>
      )}
    </div>
  )
}
