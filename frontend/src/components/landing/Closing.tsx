import './Closing.css'

interface ClosingProps {
  kicker: string
  title: string
  body: string
  ctaRoadmapLabel: string
  ctaTalkLabel: string
}

export function Closing({ kicker, title, body, ctaRoadmapLabel, ctaTalkLabel }: ClosingProps) {
  return (
    <section id="about" className="closing">
      <div className="closing__box" data-reveal>
        <div className="closing__inner">
          <div className="closing__kicker">{kicker}</div>
          <h2 className="closing__title">{title}</h2>
          <p className="closing__body">{body}</p>
          <div className="closing__actions">
            <a href="#roadmap" className="btn btn-primary">
              {ctaRoadmapLabel} →
            </a>
            <a href="#courses" className="btn btn-secondary">
              {ctaTalkLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
