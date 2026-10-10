import { useContactForm } from '../hooks/useContactForm'

export default function ContactForm() {
  const { values, setField, submit, status, error, success } = useContactForm()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'loading') return
    await submit()
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="field-row two-up">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={setField}
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={setField}
            required
          />
        </label>
      </div>

      <label className="field honeypot" aria-hidden="true">
        <span>Leave empty</span>
        <input
          type="text"
          name="website"
          value={values.website}
          onChange={setField}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <label className="field textarea-field">
        <span>Message</span>
        <textarea
          name="message"
          value={values.message}
          onChange={setField}
          minLength={10}
          maxLength={2000}
          required
        />
      </label>

      <div className="form-actions">
        <button className="button primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send'}
        </button>
      </div>

      {error ? <p className="form-message error">{error}</p> : null}
      {success ? <p className="form-message success">{success}</p> : null}
    </form>
  )
}
