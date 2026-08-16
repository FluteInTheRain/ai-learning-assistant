import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthAside } from '../components/auth/AuthAside'
import { AuthShell } from '../components/auth/AuthShell'
import { LoginForm, type LoginFormValues } from '../components/login/LoginForm'
import { ROUTES } from '../content/routes'
import { useLoginContent } from '../content/useLoginContent'
import { ApiError, login } from '../lib/api'
import { setToken } from '../lib/auth'

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
  keepSignedIn: true,
}

export function LoginPage() {
  const content = useLoginContent()
  const navigate = useNavigate()

  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      const response = await login({ email: values.email, password: values.password })
      setToken(response.access_token, values.keepSignedIn)
      navigate(ROUTES.home)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFormError(content.errors.invalidCredentials)
      } else {
        setFormError(content.errors.generic)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell aside={<AuthAside {...content.aside} />}>
      <LoginForm
        content={content}
        signupHref={ROUTES.signup}
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        submitting={submitting}
        formError={formError}
      />
    </AuthShell>
  )
}
