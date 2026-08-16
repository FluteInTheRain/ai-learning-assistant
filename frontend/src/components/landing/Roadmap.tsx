import type { Track } from '../../content/types'
import './Roadmap.css'

interface RoadmapProps {
  kicker: string
  title: string
  body: string
  tracks: Track[]
}

export function Roadmap({ kicker, title, body, tracks }: RoadmapProps) {
  return (
    <section id="roadmap" className="section">
      <div className="roadmap-head" data-reveal>
        <div>
          <div className="section-kicker">{kicker}</div>
          <h2 className="section-title">{title}</h2>
        </div>
        <p className="section-lede">{body}</p>
      </div>
      <div className="tracks">
        {tracks.map((track) => (
          <div className="track-card" key={track.name} data-reveal>
            <div className="track-card__head">
              <span className="track-card__name">{track.name}</span>
              <span className="tag tag-accent">{track.badge}</span>
            </div>
            <p className="track-card__blurb">{track.blurb}</p>
            <div className="track-card__stages">
              {track.stages.map((stage) => (
                <div className="stage" key={stage.num}>
                  <span className="stage__num">{stage.num}</span>
                  <div>
                    <div className="stage__title">{stage.title}</div>
                    <div className="stage__body">{stage.body}</div>
                    <div className="stage__meta">{stage.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
