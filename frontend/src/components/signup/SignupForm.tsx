import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { SignupContent, TrackPreference } from '../../content/types'
import './SignupForm.css'

export interface SignupFormValues {
  fullName: string
  email: string
  password: string
  track: TrackPreference | null
}

interface SignupFormProps {
  content: SignupContent
  loginHref: string
  values: SignupFormValues
  onChange: (values: SignupFormValues) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitting: boolean
  formError: string | null
}

export function SignupForm({
  content,
  loginHref,
  values,
  onChange,
  onSubmit,
  submitting,
  formError,
}: SignupFormProps) {
  return (
    <div className="signup-form">
      <div className="signup-form__kicker">{content.kicker}</div>
      <h1 className="signup-form__title">{content.title}</h1>
      <p className="signup-form__sub">{content.sub}</p>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="signup-full-name">{content.fields.fullName.label}</label>
          <input
            id="signup-full-name"
            className="input"
            type="text"
            autoComplete="name"
            required
            placeholder={content.fields.fullName.placeholder}
            value={values.fullName}
            onChange={(event) => onChange({ ...values, fullName: event.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="signup-email">{content.fields.email.label}</label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password">{content.fields.password.label}</label>
          <input
            id="signup-password"
            className="input"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={values.password}
            onChange={(event) => onChange({ ...values, password: event.target.value })}
          />
          <p className="signup-form__hint">{content.fields.password.hint}</p>
        </div>

        <div className="field">
          <span className="signup-form__track-label">{content.trackLabel}</span>
          <div className="track-picker" role="radiogroup" aria-label={content.trackLabel}>
            {content.trackOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={values.track === option.value}
                className={`track-picker__card${values.track === option.value ? ' track-picker__card--selected' : ''}`}
                onClick={() => onChange({ ...values, track: option.value })}
              >
                <span className="track-picker__title">{option.title}</span>
                <span className="track-picker__blurb">{option.blurb}</span>
              </button>
            ))}
          </div>
        </div>

        {formError && <p className="signup-form__error">{formError}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {content.submit}
        </button>

        <div className="signup-form__divider">
          <span>{content.divider}</span>
        </div>

        <button type="button" className="btn btn-secondary btn-block" disabled title="Coming soon">
          {content.sso}
        </button>
      </form>

      <p className="signup-form__terms">{content.terms}</p>
      <p className="signup-form__switch">
        {content.switchNote} <Link to={loginHref}>{content.switchAction}</Link>
      </p>
    </div>
  )
}
