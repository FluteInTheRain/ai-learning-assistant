import { AletheiaMark } from '../AletheiaMark'
import './Hero.css'

interface HeroProps {
  kicker: string
  titleLead: string
  titleAccent: string
  body: string
  imgCaption: string
  ctaRoadmapLabel: string
  ctaBrowseLabel: string
}

export function Hero({ kicker, titleLead, titleAccent, body, imgCaption, ctaRoadmapLabel, ctaBrowseLabel }: HeroProps) {
  return (
    <section id="top" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__content" data-reveal>
        <div className="hero__badge" aria-hidden="true">
          <span className="hero__badge-mark">
            <AletheiaMark className="hero__badge-icon" />
          </span>
        </div>
        <div className="hero__kicker">{kicker}</div>
        <h1 className="hero__title">
          {titleLead} <span className="hero__title-accent">{titleAccent}</span>
        </h1>
        <div className="hero__rule" aria-hidden="true" />
        <p className="hero__body">{body}</p>
        <div className="hero__actions">
          <a href="#roadmap" className="btn btn-primary btn--lg">
            {ctaRoadmapLabel} →
          </a>
          <a href="#courses" className="btn btn-secondary btn--lg">
            {ctaBrowseLabel}
          </a>
        </div>
        <div className="hero__image">
          <span>{imgCaption}</span>
        </div>
      </div>
    </section>
  )
}
