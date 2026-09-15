import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import profile from '../data/profile.json'
import { useScrollSpy } from '../hooks/useScrollSpy'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const NAV_IDS = NAV_ITEMS.map((item) => item.id)

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const activeId = useScrollSpy(NAV_IDS)

  const linkClasses = (id) =>
    `rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
      activeId === id
        ? 'bg-clay-recess text-clay-accent shadow-clayPressedSoft'
        : 'text-clay-muted hover:-translate-y-0.5 hover:bg-white/80 hover:text-clay-text'
    }`

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-clay-card border border-white/70 bg-white/70 px-4 shadow-clayNav backdrop-blur-xl sm:px-6">
        <a href="#home" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="font-display flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-clay-accent-soft to-clay-accent text-sm font-black text-white shadow-clayChip">
            {initials}
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-clay-text">
            {profile.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={linkClasses(item.id)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="font-display hidden h-11 items-center justify-center rounded-clay-btn bg-linear-to-r from-clay-accent-soft to-clay-accent px-5 text-sm font-extrabold text-white shadow-clayButton transition-all duration-200 hover:-translate-y-1 hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed sm:inline-flex"
          >
            Let&apos;s talk
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-clay-btn bg-white/80 text-xl text-clay-accent shadow-clayChip transition-all duration-200 hover:-translate-y-0.5 hover:shadow-clayChipHover active:scale-90 active:shadow-clayPressed lg:hidden"
          >
            {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-3 max-w-6xl rounded-clay-pill border border-white/70 bg-white/80 p-3 shadow-clayNav backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-[16px] px-4 py-3 text-sm font-bold transition-colors duration-200 ${
                    activeId === item.id
                      ? 'bg-clay-recess text-clay-accent shadow-clayPressedSoft'
                      : 'text-clay-muted hover:bg-white/80 hover:text-clay-text'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
