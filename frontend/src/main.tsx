import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
// Self-hosted Inter (the Aletheia design's only typeface, used for both
// headings and body text) — imported before the token/component CSS so
// `var(--font-*)` references resolve correctly.
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './styles/tokens.css'
import './index.css'
import './i18n'

// Set the theme before the first paint so there is no light->dark (or
// vice versa) flash while React mounts and ThemeToggle's effect runs.
const storedTheme = localStorage.getItem('aletheia-theme')
document.documentElement.setAttribute('data-theme', storedTheme === 'light' ? 'light' : 'dark')

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
