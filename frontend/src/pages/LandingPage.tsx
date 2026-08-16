import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './LandingPage.css'

interface Stat {
  value: string
  label: string
}

interface Stage {
  num: string
  title: string
  body: string
  meta: string
}

interface Track {
  name: string
  badge: string
  blurb: string
  stages: Stage[]
}

interface Course {
  kicker: string
  level: string
  title: string
  body: string
  lessons: string
  hours: string
  labs: string
  img: string
}

interface Post {
  date: string
  title: string
  body: string
  tag: string
}

export function LandingPage() {
  const { t: tc } = useTranslation('common')
  const { t } = useTranslation('landing')

  const stats = t('stats', { returnObjects: true }) as Stat[]
  const tracks = t('tracks', { returnObjects: true }) as Track[]
  const courses = t('courses.items', { returnObjects: true }) as Course[]
  const posts = t('journal.posts', { returnObjects: true }) as Post[]

  const rootRef = useRef<HTMLDivElement>(null)
  useScrollReveal(rootRef)

  return (
    <div ref={rootRef}>
      <header className="landing-header">
        <div className="landing-header__inner">
          <a href="#top" className="landing-header__brand">
            <span className="landing-header__brand-mark" aria-hidden="true">
              A
            </span>
            <span className="landing-header__brand-text">
              <span className="landing-header__brand-name">{tc('brand.name')}</span>
              <span className="landing-header__brand-tagline">{tc('brand.tagline')}</span>
            </span>
          </a>
          <nav className="landing-nav">
            <a href="#roadmap">{t('nav.roadmap')}</a>
            <a href="#courses">{t('nav.courses')}</a>
            <a href="#journal">{t('nav.journal')}</a>
            <a href="#about">{t('nav.about')}</a>
          </nav>
          <ThemeToggle />
          <Link to="/signup" className="btn btn-primary">
            {t('ctaPrimary')}
          </Link>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__content" data-reveal>
          <div className="hero__badge" aria-hidden="true">
            <span className="hero__badge-mark">A</span>
          </div>
          <div className="hero__kicker">{t('kicker')}</div>
          <h1 className="hero__title">
            {t('hero.titleLead')} <span className="hero__title-accent">{t('hero.titleAccent')}</span>
          </h1>
          <div className="hero__rule" aria-hidden="true" />
          <p className="hero__body">{t('hero.body')}</p>
          <div className="hero__actions">
            <a href="#roadmap" className="btn btn-primary btn--lg">
              {t('ctaRoadmap')} →
            </a>
            <a href="#courses" className="btn btn-secondary btn--lg">
              {t('ctaBrowse')}
            </a>
          </div>
          <div className="hero__image">
            <span>{t('hero.imgCampus')}</span>
          </div>
        </div>
      </section>

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

      <section id="roadmap" className="section">
        <div className="roadmap-head" data-reveal>
          <div>
            <div className="section-kicker">{t('roadmap.kicker')}</div>
            <h2 className="section-title">{t('roadmap.title')}</h2>
          </div>
          <p className="section-lede">{t('roadmap.body')}</p>
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

      <section id="courses" className="section">
        <div className="courses-head" data-reveal>
          <div>
            <div className="section-kicker">{t('courses.kicker')}</div>
            <h2 className="section-title">{t('courses.title')}</h2>
          </div>
          <Link to="/catalog">{t('courses.all')} →</Link>
        </div>
        <div className="courses-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.title} data-reveal>
              <div className="course-card__image">
                <span>{course.img}</span>
              </div>
              <div className="course-card__body">
                <div className="course-card__meta-row">
                  <span className="course-card__kicker">{course.kicker}</span>
                  <span className="tag tag-outline">{course.level}</span>
                </div>
                <div className="course-card__title">{course.title}</div>
                <div className="course-card__desc">{course.body}</div>
                <div className="course-card__facts">
                  <span>{course.lessons}</span>
                  <span>{course.hours}</span>
                  <span>{course.labs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="journal" className="section">
        <div className="journal-head" data-reveal>
          <div>
            <div className="section-kicker">{t('journal.kicker')}</div>
            <h2 className="section-title">{t('journal.title')}</h2>
          </div>
          <p className="section-lede">{t('journal.body')}</p>
        </div>
        <div className="journal-list">
          {posts.map((post) => (
            <a href="#journal" className="journal-post" key={post.title} data-reveal>
              <span className="journal-post__date">{post.date}</span>
              <div>
                <div className="journal-post__title">{post.title}</div>
                <div className="journal-post__body">{post.body}</div>
              </div>
              <span className="journal-post__tag">{post.tag}</span>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="closing">
        <div className="closing__box" data-reveal>
          <div className="closing__inner">
            <div className="closing__kicker">{t('closing.kicker')}</div>
            <h2 className="closing__title">{t('closing.title')}</h2>
            <p className="closing__body">{t('closing.body')}</p>
            <div className="closing__actions">
              <a href="#roadmap" className="btn btn-primary">
                {t('ctaRoadmap')} →
              </a>
              <a href="#courses" className="btn btn-secondary">
                {t('ctaTalk')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <span className="landing-footer__brand">{tc('brand.name')}</span>
          <span className="landing-footer__note">{t('footerNote')}</span>
          <div className="landing-footer__links">
            <a href="#about">{t('nav.about')}</a>
            <a href="#journal">{t('nav.journal')}</a>
            <a href="#courses">{t('nav.courses')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
