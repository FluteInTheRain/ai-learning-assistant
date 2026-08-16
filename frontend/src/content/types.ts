// Shared content shapes. These mirror the i18n JSON structure today, but
// are the seam a future API-backed page would target too — components
// consume these types, never `t()` call shapes directly.

export interface NavItem {
  id: string
  labelKey: string
  href: string
}

export interface ResolvedNavItem {
  id: string
  href: string
  label: string
}

export interface Stat {
  value: string
  label: string
}

export interface Stage {
  num: string
  title: string
  body: string
  meta: string
}

export interface Track {
  name: string
  badge: string
  blurb: string
  stages: Stage[]
}

export interface Course {
  kicker: string
  level: string
  title: string
  body: string
  lessons: string
  hours: string
  labs: string
  img: string
}

export interface Post {
  date: string
  title: string
  body: string
  tag: string
}
