import { useRef } from 'react'
import { Closing } from '../components/landing/Closing'
import { CourseLibrary } from '../components/landing/CourseLibrary'
import { Hero } from '../components/landing/Hero'
import { Journal } from '../components/landing/Journal'
import { LandingFooter } from '../components/landing/LandingFooter'
import { LandingHeader } from '../components/landing/LandingHeader'
import { Roadmap } from '../components/landing/Roadmap'
import { StatBand } from '../components/landing/StatBand'
import { ROUTES } from '../content/routes'
import { useLandingContent } from '../content/useLandingContent'
import { useScrollReveal } from '../hooks/useScrollReveal'

// Composition root only: loads content once via `useLandingContent` and
// hands typed props down to presentational section components. Add a new
// section by adding one line here plus a component under
// `components/landing/` — no other file needs to change.
export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollReveal(rootRef)

  const content = useLandingContent()

  return (
    <div ref={rootRef}>
      <LandingHeader
        brand={content.brand}
        navItems={content.headerNav}
        ctaLabel={content.ctaPrimary}
        ctaTo={ROUTES.signup}
      />
      <Hero
        kicker={content.kicker}
        titleLead={content.hero.titleLead}
        titleAccent={content.hero.titleAccent}
        body={content.hero.body}
        imgCaption={content.hero.imgCampus}
        ctaRoadmapLabel={content.ctaRoadmap}
        ctaBrowseLabel={content.ctaBrowse}
      />
      <StatBand stats={content.stats} />
      <Roadmap
        kicker={content.roadmap.kicker}
        title={content.roadmap.title}
        body={content.roadmap.body}
        tracks={content.tracks}
      />
      <CourseLibrary
        kicker={content.courses.kicker}
        title={content.courses.title}
        allLabel={content.courses.all}
        allTo={ROUTES.catalog}
        courses={content.courses.items}
      />
      <Journal
        kicker={content.journal.kicker}
        title={content.journal.title}
        body={content.journal.body}
        posts={content.journal.posts}
      />
      <Closing
        kicker={content.closing.kicker}
        title={content.closing.title}
        body={content.closing.body}
        ctaRoadmapLabel={content.ctaRoadmap}
        ctaTalkLabel={content.ctaTalk}
      />
      <LandingFooter brandName={content.brand.name} note={content.footerNote} navItems={content.footerNav} />
    </div>
  )
}
