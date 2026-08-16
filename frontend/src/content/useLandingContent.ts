import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { FOOTER_NAV_IDS, HEADER_NAV_IDS, NAV_ITEMS } from './navigation'
import type { Course, Post, ResolvedNavItem, Stat, Track } from './types'

function resolveNavItems(ids: readonly string[], t: TFunction): ResolvedNavItem[] {
  return ids.map((id) => {
    const item = NAV_ITEMS[id]
    return { id: item.id, href: item.href, label: t(item.labelKey) }
  })
}

export interface LandingContent {
  brand: { name: string; tagline: string }
  headerNav: ResolvedNavItem[]
  footerNav: ResolvedNavItem[]
  ctaPrimary: string
  kicker: string
  hero: { titleLead: string; titleAccent: string; body: string; imgCampus: string }
  ctaRoadmap: string
  ctaBrowse: string
  ctaTalk: string
  stats: Stat[]
  roadmap: { kicker: string; title: string; body: string }
  tracks: Track[]
  courses: { kicker: string; title: string; all: string; items: Course[] }
  journal: { kicker: string; title: string; body: string; posts: Post[] }
  closing: { kicker: string; title: string; body: string }
  footerNote: string
}

/**
 * The single place that reads i18n (or, later, an API) for the landing
 * page and shapes it into typed content. Every landing section component
 * takes its content as props from here — none of them call `t()` or know
 * where the copy comes from, so swapping the source later (e.g. courses
 * from a real endpoint instead of static JSON) only touches this file.
 */
export function useLandingContent(): LandingContent {
  const { t: tc } = useTranslation('common')
  const { t } = useTranslation('landing')

  return {
    brand: { name: tc('brand.name'), tagline: tc('brand.tagline') },
    headerNav: resolveNavItems(HEADER_NAV_IDS, t),
    footerNav: resolveNavItems(FOOTER_NAV_IDS, t),
    ctaPrimary: t('ctaPrimary'),
    kicker: t('kicker'),
    hero: {
      titleLead: t('hero.titleLead'),
      titleAccent: t('hero.titleAccent'),
      body: t('hero.body'),
      imgCampus: t('hero.imgCampus'),
    },
    ctaRoadmap: t('ctaRoadmap'),
    ctaBrowse: t('ctaBrowse'),
    ctaTalk: t('ctaTalk'),
    stats: t('stats', { returnObjects: true }) as Stat[],
    roadmap: {
      kicker: t('roadmap.kicker'),
      title: t('roadmap.title'),
      body: t('roadmap.body'),
    },
    tracks: t('tracks', { returnObjects: true }) as Track[],
    courses: {
      kicker: t('courses.kicker'),
      title: t('courses.title'),
      all: t('courses.all'),
      items: t('courses.items', { returnObjects: true }) as Course[],
    },
    journal: {
      kicker: t('journal.kicker'),
      title: t('journal.title'),
      body: t('journal.body'),
      posts: t('journal.posts', { returnObjects: true }) as Post[],
    },
    closing: {
      kicker: t('closing.kicker'),
      title: t('closing.title'),
      body: t('closing.body'),
    },
    footerNote: t('footerNote'),
  }
}
