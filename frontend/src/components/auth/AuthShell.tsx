import type { ReactNode } from 'react'
import { ThemeToggle } from '../ThemeToggle'
import './AuthShell.css'

interface AuthShellProps {
  aside: ReactNode
  children: ReactNode
}

/** Two-column shell shared by /signup and /login: gradient aside + centered form column. */
export function AuthShell({ aside, children }: AuthShellProps) {
  return (
    <div className="auth-shell">
      <aside className="auth-shell__aside">{aside}</aside>
      <div className="auth-shell__panel">
        <div className="auth-shell__panel-top">
          <ThemeToggle />
        </div>
        <div className="auth-shell__panel-content">{children}</div>
      </div>
    </div>
  )
}
