import { AletheiaMark } from '../AletheiaMark'
import type { AuthAsideContent } from '../../content/types'
import './AuthAside.css'

export function AuthAside({ brand, quote, attribution, stats }: AuthAsideContent) {
  return (
    <div className="auth-aside">
      <div className="auth-aside__brand">
        <AletheiaMark className="auth-aside__mark" />
        <span className="auth-aside__brand-name">{brand.name}</span>
      </div>
      <blockquote className="auth-aside__quote">
        <p>&ldquo;{quote}&rdquo;</p>
        <footer>— {attribution}</footer>
      </blockquote>
      <dl className="auth-aside__stats">
        {stats.map((stat) => (
          <div className="auth-aside__stat" key={stat.label}>
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
