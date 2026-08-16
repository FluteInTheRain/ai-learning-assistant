import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import auth from './locales/en/auth.json'
import common from './locales/en/common.json'
import landing from './locales/en/landing.json'
import login from './locales/en/login.json'
import signup from './locales/en/signup.json'

// English-only for now, but routed through i18next so adding a locale later
// is a matter of dropping in `locales/<lng>/*.json` and extending
// `resources` + `supportedLngs` — no component rework.
void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en'],
  resources: {
    en: { common, landing, auth, signup, login },
  },
  interpolation: { escapeValue: false },
})

export default i18n
