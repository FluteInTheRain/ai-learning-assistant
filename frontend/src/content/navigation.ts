import type { NavItem } from './types'

// Single source of truth for every landing-page nav destination: an id,
// the i18n key for its label, and where it points. The header and footer
// each show a different subset (see `HEADER_NAV_IDS`/`FOOTER_NAV_IDS`
// below) — add a destination here once and reference it by id wherever
// it's needed, instead of retyping the href/label pair at each call site.
export const NAV_ITEMS: Record<string, NavItem> = {
  roadmap: { id: 'roadmap', labelKey: 'nav.roadmap', href: '#roadmap' },
  courses: { id: 'courses', labelKey: 'nav.courses', href: '#courses' },
  journal: { id: 'journal', labelKey: 'nav.journal', href: '#journal' },
  about: { id: 'about', labelKey: 'nav.about', href: '#about' },
}

export const HEADER_NAV_IDS = ['roadmap', 'courses', 'journal', 'about'] as const
export const FOOTER_NAV_IDS = ['about', 'journal', 'courses'] as const
