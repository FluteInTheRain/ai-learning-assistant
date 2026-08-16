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

export interface AuthAsideContent {
  brand: { name: string; tagline: string }
  quote: string
  attribution: string
  stats: Stat[]
}

export type TrackPreference = 'applied' | 'technical'

export interface TrackOption {
  value: TrackPreference
  title: string
  blurb: string
}

export interface SignupContent {
  aside: AuthAsideContent
  kicker: string
  title: string
  sub: string
  fields: {
    fullName: { label: string; placeholder: string }
    email: { label: string; placeholder: string }
    password: { label: string; placeholder: string; hint: string }
  }
  trackLabel: string
  trackOptions: TrackOption[]
  submit: string
  divider: string
  sso: string
  terms: string
  switchNote: string
  switchAction: string
  errors: {
    emailTaken: string
    generic: string
    trackRequired: string
  }
}

export interface LoginContent {
  aside: AuthAsideContent
  kicker: string
  title: string
  sub: string
  fields: {
    email: { label: string; placeholder: string }
    password: { label: string; placeholder: string }
  }
  keepSignedIn: string
  forgotPassword: string
  submit: string
  divider: string
  sso: string
  switchNote: string
  switchAction: string
  errors: {
    invalidCredentials: string
    generic: string
  }
}
