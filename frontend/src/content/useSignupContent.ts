import { useTranslation } from 'react-i18next'
import { useAuthAsideContent } from './useAuthAsideContent'
import type { SignupContent, TrackPreference } from './types'

const TRACK_ORDER: TrackPreference[] = ['applied', 'technical']

// The only place that reads i18n for the signup page.
export function useSignupContent(): SignupContent {
  const { t } = useTranslation('signup')
  const aside = useAuthAsideContent()

  return {
    aside,
    kicker: t('kicker'),
    title: t('title'),
    sub: t('sub'),
    fields: {
      fullName: {
        label: t('fields.fullName.label'),
        placeholder: t('fields.fullName.placeholder'),
      },
      email: {
        label: t('fields.email.label'),
        placeholder: t('fields.email.placeholder'),
      },
      password: {
        label: t('fields.password.label'),
        placeholder: t('fields.password.placeholder'),
        hint: t('fields.password.hint'),
      },
    },
    trackLabel: t('track.label'),
    trackOptions: TRACK_ORDER.map((value) => ({
      value,
      title: t(`track.options.${value}.title`),
      blurb: t(`track.options.${value}.blurb`),
    })),
    submit: t('submit'),
    divider: t('divider'),
    sso: t('sso'),
    terms: t('terms'),
    switchNote: t('switchNote'),
    switchAction: t('switchAction'),
    errors: {
      emailTaken: t('errors.emailTaken'),
      generic: t('errors.generic'),
      trackRequired: t('errors.trackRequired'),
    },
  }
}
