import { Route, Routes } from 'react-router-dom'
import { ROUTES } from './content/routes'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<LandingPage />} />
      <Route path={ROUTES.signup} element={<SignupPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
    </Routes>
  )
}

export default App
