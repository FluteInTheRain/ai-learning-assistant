import type { Stat } from '../../content/types'
import './StatBand.css'

interface StatBandProps {
  stats: Stat[]
}

export function StatBand({ stats }: StatBandProps) {
  return (
    <section className="stat-band">
      <div className="stat-band__inner">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
