import type { ResolvedNavItem } from '../../content/types'
import './LandingFooter.css'

interface LandingFooterProps {
  brandName: string
  note: string
  navItems: ResolvedNavItem[]
}

export function LandingFooter({ brandName, note, navItems }: LandingFooterProps) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <span className="landing-footer__brand">{brandName}</span>
        <span className="landing-footer__note">{note}</span>
        <div className="landing-footer__links">
          {navItems.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
