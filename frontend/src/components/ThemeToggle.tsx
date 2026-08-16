import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'aletheia-theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

export function ThemeToggle() {
  const { t } = useTranslation('common')
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        className={`theme-toggle__option${theme === 'dark' ? ' theme-toggle__option--active' : ''}`}
        aria-pressed={theme === 'dark'}
        onClick={() => setTheme('dark')}
      >
        <span aria-hidden="true">◐</span>
        <span className="sr-only">{t('theme.dark')}</span>
      </button>
      <button
        type="button"
        className={`theme-toggle__option${theme === 'light' ? ' theme-toggle__option--active' : ''}`}
        aria-pressed={theme === 'light'}
        onClick={() => setTheme('light')}
      >
        <span aria-hidden="true">◑</span>
        <span className="sr-only">{t('theme.light')}</span>
      </button>
    </div>
  )
}
