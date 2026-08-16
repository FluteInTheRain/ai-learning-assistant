import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthAside } from '../components/auth/AuthAside'
import { AuthShell } from '../components/auth/AuthShell'
import { SignupForm, type SignupFormValues } from '../components/signup/SignupForm'
import { ROUTES } from '../content/routes'
import { useSignupContent } from '../content/useSignupContent'
import { ApiError, signup } from '../lib/api'
import { setToken } from '../lib/auth'

const INITIAL_VALUES: SignupFormValues = {
  fullName: '',
  email: '',
  password: '',
  track: null,
}

export function SignupPage() {
  const content = useSignupContent()
  const navigate = useNavigate()

  const [values, setValues] = useState<SignupFormValues>(INITIAL_VALUES)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!values.track) {
      setFormError(content.errors.trackRequired)
      return
    }

    setSubmitting(true)
    try {
      const response = await signup({
        full_name: values.fullName,
        email: values.email,
        password: values.password,
        track_preference: values.track,
      })
      setToken(response.access_token)
      navigate(ROUTES.home)
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setFormError(content.errors.emailTaken)
      } else {
        setFormError(content.errors.generic)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell aside={<AuthAside {...content.aside} />}>
      <SignupForm
        content={content}
        loginHref={ROUTES.login}
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        submitting={submitting}
        formError={formError}
      />
    </AuthShell>
  )
}
