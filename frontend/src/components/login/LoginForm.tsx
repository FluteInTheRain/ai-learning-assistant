import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { LoginContent } from '../../content/types'
import './LoginForm.css'

export interface LoginFormValues {
  email: string
  password: string
  keepSignedIn: boolean
}

interface LoginFormProps {
  content: LoginContent
  signupHref: string
  values: LoginFormValues
  onChange: (values: LoginFormValues) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitting: boolean
  formError: string | null
}

export function LoginForm({
  content,
  signupHref,
  values,
  onChange,
  onSubmit,
  submitting,
  formError,
}: LoginFormProps) {
  return (
    <div className="login-form">
      <div className="login-form__kicker">{content.kicker}</div>
      <h1 className="login-form__title">{content.title}</h1>
      <p className="login-form__sub">{content.sub}</p>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="login-email">{content.fields.email.label}</label>
          <input
            id="login-email"
            className="input"
            type="email"
            autoComplete="email"
            required
            placeholder={content.fields.email.placeholder}
            value={values.email}
            onChange={(event) => onChange({ ...values, email: event.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="login-password">{content.fields.password.label}</label>
          <input
            id="login-password"
            className="input"
            type="password"
            autoComplete="current-password"
            required
            value={values.password}
            onChange={(event) => onChange({ ...values, password: event.target.value })}
          />
        </div>

        <div className="login-form__options">
          <label className="login-form__checkbox">
            <input
              type="checkbox"
              checked={values.keepSignedIn}
              onChange={(event) =>
                onChange({ ...values, keepSignedIn: event.target.checked })
              }
            />
            {content.keepSignedIn}
          </label>
          <span className="login-form__forgot" aria-disabled="true" title="Coming soon">
            {content.forgotPassword}
          </span>
        </div>

        {formError && <p className="login-form__error">{formError}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {content.submit}
        </button>

        <div className="login-form__divider">
          <span>{content.divider}</span>
        </div>

        <button type="button" className="btn btn-secondary btn-block" disabled title="Coming soon">
          {content.sso}
        </button>
      </form>

      <p className="login-form__switch">
        {content.switchNote} <Link to={signupHref}>{content.switchAction}</Link>
      </p>
    </div>
  )
}
