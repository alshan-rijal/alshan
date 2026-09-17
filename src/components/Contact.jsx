import emailjs from '@emailjs/browser'
import { Fragment, useState } from 'react'
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiSend,
} from 'react-icons/fi'
import { EMAILJS, isEmailJsConfigured } from '../config/emailjs'
import profile from '../data/profile.json'
import { getIcon } from '../lib/icons'
import ClayButton from './ui/ClayButton'
import ClayCard from './ui/ClayCard'
import IconOrb from './ui/IconOrb'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const EMPTY_FORM = { name: '', email: '', message: '' }

const fieldBase =
  'w-full rounded-2xl border-0 bg-clay-recess px-5 font-medium text-clay-text shadow-clayPressed transition-all duration-300 placeholder:text-clay-muted/70 focus:bg-clay-surface focus:shadow-none focus:ring-4 focus:ring-clay-accent/20 focus:outline-none focus-visible:outline-none'

const contactDetails = [
  {
    icon: 'mail',
    label: 'Email',
    value: profile.contact.email,
    href: `mailto:${profile.contact.email}`,
  },
  {
    icon: 'phone',
    label: 'Phone',
    values: profile.contact.phones.map((phone) => ({
      value: phone,
      href: `tel:${phone.replace(/[^+\d]/g, '')}`,
    })),
  },
  {
    icon: 'globe',
    label: 'Website',
    value: profile.contact.website,
    href: `https://${profile.contact.website}`,
  },
  { icon: 'location', label: 'Location', value: profile.location, href: null },
]

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    if (!isEmailJsConfigured()) {
      setStatus('error')
      setFeedback(
        'EmailJS is not configured yet. Add your SERVICE_ID, TEMPLATE_ID and PUBLIC_KEY in src/config/emailjs.js.',
      )
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
  EMAILJS.SERVICE_ID,
  EMAILJS.TEMPLATE_ID,
  {
    name: form.name,
    email: form.email,
    to_email: profile.contact.email,
    message: form.message,
  },
  { publicKey: EMAILJS.PUBLIC_KEY },
)

      try {
        const autoReply = await fetch('/send-autoreply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email }),
        })
        if (!autoReply.ok) console.error('Auto-reply failed:', autoReply.status)
      } catch (autoReplyError) {
        console.error('Auto-reply error:', autoReplyError)
      }

      setStatus('success')
      setFeedback('Message sent! I will get back to you within a day or two.')
      setForm(EMPTY_FORM)
    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
      const detail =
        typeof error?.text === 'string' && error.text.trim() && error.text.trim() !== 'OK'
          ? error.text.trim()
          : null
      setFeedback(
        detail
          ? `Something went wrong sending your message: ${detail}`
          : 'Something went wrong sending your message. Please try again, or email me directly.',
      )
    }
  }

  return (
    <section id="contact" className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something"
            highlight="squishy."
            subtitle="Have a project, a role, or just a fun idea? My inbox is always open."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="h-full">
            <ClayCard className="h-full" innerClassName="gap-7">
              <div>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-clay-text">
                  Contact details
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-clay-muted">
                  Prefer email? Reach me directly — or use the form and it lands in the same
                  inbox.
                </p>
              </div>

              <ul className="flex flex-col gap-5">
                {contactDetails.map((detail) => (
                  <li key={detail.label} className="flex items-center gap-4">
                    <IconOrb icon={detail.icon} tone="violet" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-clay-muted">
                        {detail.label}
                      </p>
                      {detail.values ? (
                        <p className="font-display break-words text-base font-extrabold text-clay-text">
                          {detail.values.map((entry, index) => (
                            <Fragment key={entry.value}>
                              {index > 0 && <span className="text-clay-muted"> / </span>}
                              <a
                                href={entry.href}
                                className="transition-colors duration-200 hover:text-clay-accent"
                              >
                                {entry.value}
                              </a>
                            </Fragment>
                          ))}
                        </p>
                      ) : detail.href ? (
                        <a
                          href={detail.href}
                          className="font-display block break-words text-base font-extrabold text-clay-text transition-colors duration-200 hover:text-clay-accent"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="font-display text-base font-extrabold text-clay-text">
                          {detail.value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="text-[11px] font-bold uppercase tracking-wide text-clay-muted">
                  Social
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {profile.contact.socials.map((social) => {
                    const Icon = getIcon(social.icon)
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        aria-label={social.platform}
                        target={social.url.startsWith('http') ? '_blank' : undefined}
                        rel={social.url.startsWith('http') ? 'noreferrer' : undefined}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-clay-border/70 bg-clay-surface/80 text-xl text-clay-accent shadow-clayChip transition-all duration-200 hover:-translate-y-1 hover:shadow-clayChipHover active:scale-90 active:shadow-clayPressed"
                      >
                        <Icon aria-hidden="true" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </ClayCard>
          </Reveal>

          <Reveal delay={120} className="h-full">
            <ClayCard className="h-full" hover={false}>
              <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-clay-muted"
                    >
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Ada Lovelace"
                      value={form.name}
                      onChange={handleChange}
                      className={`${fieldBase} h-16`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-clay-muted"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="ada@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={`${fieldBase} h-16`}
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-clay-muted"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell me about your project, timeline and budget…"
                    value={form.message}
                    onChange={handleChange}
                    className={`${fieldBase} min-h-[170px] flex-1 resize-y py-4`}
                  />
                </div>

                {status === 'success' && (
                  <div
                    aria-live="polite"
                    className="flex items-center gap-3 rounded-clay-pill bg-clay-emerald/10 px-5 py-4 text-sm font-bold text-clay-emerald shadow-clayPressedSoft"
                  >
                    <FiCheckCircle aria-hidden="true" className="shrink-0 text-xl" />
                    {feedback}
                  </div>
                )}

                {status === 'error' && (
                  <div
                    aria-live="assertive"
                    className="flex items-center gap-3 rounded-clay-pill bg-clay-pink/10 px-5 py-4 text-sm font-bold text-clay-pink shadow-clayPressedSoft"
                  >
                    <FiAlertCircle aria-hidden="true" className="shrink-0 text-xl" />
                    {feedback}
                  </div>
                )}

                <ClayButton
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full sm:w-auto sm:self-start"
                >
                  {status === 'sending' ? (
                    <>
                      <FiLoader aria-hidden="true" className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <FiSend aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </ClayButton>
              </form>
            </ClayCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
