import { FiArrowUp } from 'react-icons/fi'
import profile from '../data/profile.json'
import { getIcon } from '../lib/icons'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <footer className="relative px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-clay-container border border-clay-border/70 bg-clay-surface/60 p-8 shadow-clayCard backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <span className="font-display flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-clay-accent-soft to-clay-accent text-sm font-black text-white shadow-clayChip">
                  {initials}
                </span>
                <span className="font-display text-xl font-extrabold tracking-tight text-clay-text">
                  {profile.name}
                </span>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-clay-muted">
                {profile.tagline}
              </p>
            </div>

            <nav aria-label="Footer">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-clay-muted">
                Explore
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm font-bold text-clay-text transition-colors duration-200 hover:text-clay-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-clay-muted">
                Find me on
              </h3>
              <div className="mt-4 flex items-center gap-3">
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
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-clay-accent/10 pt-6 sm:flex-row">
            <p className="text-xs font-bold text-clay-muted">
              © {year} {profile.name}. Handcrafted clay, zero sharp corners.
            </p>
            <a
              href="#home"
              className="inline-flex items-center gap-2 rounded-full bg-clay-surface/80 px-4 py-2 text-xs font-bold text-clay-accent shadow-clayChip transition-all duration-200 hover:-translate-y-0.5 hover:shadow-clayChipHover active:scale-90 active:shadow-clayPressed"
            >
              <FiArrowUp aria-hidden="true" />
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
