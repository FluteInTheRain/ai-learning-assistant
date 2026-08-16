import { Link } from 'react-router-dom'
import { ThemeToggle } from '../ThemeToggle'
import { AletheiaMark } from '../AletheiaMark'
import type { ResolvedNavItem } from '../../content/types'
import './LandingHeader.css'

interface LandingHeaderProps {
  brand: { name: string; tagline: string }
  navItems: ResolvedNavItem[]
  ctaLabel: string
  ctaTo: string
}

export function LandingHeader({ brand, navItems, ctaLabel, ctaTo }: LandingHeaderProps) {
  return (
    <header className="landing-header">
      <div className="landing-header__inner">
        <a href="#top" className="landing-header__brand">
          <span className="landing-header__brand-mark" aria-hidden="true">
            <AletheiaMark className="landing-header__brand-icon" />
          </span>
          <span className="landing-header__brand-text">
            <span className="landing-header__brand-name">{brand.name}</span>
            <span className="landing-header__brand-tagline">{brand.tagline}</span>
          </span>
        </a>
        <nav className="landing-nav">
          {navItems.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
        <Link to={ctaTo} className="btn btn-primary">
          {ctaLabel}
        </Link>
      </div>
    </header>
  )
}
