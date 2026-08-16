import { useTranslation } from 'react-i18next'
import { useAuthAsideContent } from './useAuthAsideContent'
import type { LoginContent } from './types'

// The only place that reads i18n for the login page.
export function useLoginContent(): LoginContent {
  const { t } = useTranslation('login')
  const aside = useAuthAsideContent()

  return {
    aside,
    kicker: t('kicker'),
    title: t('title'),
    sub: t('sub'),
    fields: {
      email: {
        label: t('fields.email.label'),
        placeholder: t('fields.email.placeholder'),
      },
      password: {
        label: t('fields.password.label'),
        placeholder: t('fields.password.placeholder'),
      },
    },
    keepSignedIn: t('keepSignedIn'),
    forgotPassword: t('forgotPassword'),
    submit: t('submit'),
    divider: t('divider'),
    sso: t('sso'),
    switchNote: t('switchNote'),
    switchAction: t('switchAction'),
    errors: {
      invalidCredentials: t('errors.invalidCredentials'),
      generic: t('errors.generic'),
    },
  }
}
