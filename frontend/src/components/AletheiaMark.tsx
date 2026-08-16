interface AletheiaMarkProps {
  className?: string
}

/** The "A" mark: lapidary-serif A rising from an open book, with a floating light-gap crossbar. */
export function AletheiaMark({ className }: AletheiaMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      <path d="M50,66 L8,66 L8,90 L50,84 Z" />
      <path d="M50,66 L92,66 L92,90 L50,84 Z" />
      <rect x="48" y="66" width="4" height="18" rx="1" />
      <path fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="butt" d="M50,8 L24,62" />
      <path fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="butt" d="M50,8 L76,62" />
      <polygon points="17,58 33,58 37,66 13,66" />
      <polygon points="83,58 67,58 63,66 87,66" />
      <rect x="42" y="36" width="16" height="8" rx="1.5" />
    </svg>
  )
}
