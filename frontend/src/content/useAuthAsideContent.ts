import { useTranslation } from 'react-i18next'
import type { AuthAsideContent, Stat } from './types'

// Shared aside content (brand mark, pull-quote, stats), reused by /signup and /login.
export function useAuthAsideContent(): AuthAsideContent {
  const { t: tc } = useTranslation('common')
  const { t } = useTranslation('auth')

  return {
    brand: { name: tc('brand.name'), tagline: tc('brand.tagline') },
    quote: t('aside.quote'),
    attribution: t('aside.attribution'),
    stats: t('aside.stats', { returnObjects: true }) as Stat[],
  }
}
