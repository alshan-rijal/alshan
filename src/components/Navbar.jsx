import { useEffect, useRef, useState } from 'react'
import profile from '../data/profile.json'
import BrandLogo from './BrandLogo'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { useTheme } from '../hooks/useTheme'
import { useRouteNavigation } from '../hooks/useRouteNavigation'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 15.5A7.5 7.5 0 0 1 8.5 4a7.5 7.5 0 1 0 11.5 11.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const NAV_IDS = NAV_ITEMS.map((item) => item.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)
  const { location, navigate } = useRouteNavigation()
  const activeId = useScrollSpy(NAV_IDS, 160, location.pathname === '/')
  const { theme, toggleTheme } = useTheme()
  const homeRoute = (id) => (id === 'home' ? '/' : `/#${id}`)
  const handleNavigation = (event, id) => {
    event.preventDefault()
    setOpen(false)
    navigate(homeRoute(id))
  }

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      document.querySelector('.site-shell')?.removeAttribute('inert')
      menuButtonRef.current?.focus()
      return undefined
    }

    document.body.style.overflow = 'hidden'
    document.querySelector('.site-shell')?.setAttribute('inert', '')
    const menu = menuRef.current
    const focusable = menu?.querySelectorAll('a, button')
    focusable?.[0]?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      document.querySelector('.site-shell')?.removeAttribute('inert')
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const linkClasses = (id) =>
    `nav-item${activeId === id ? ' active' : ''}`

  return (
    <header className="site-header">
      <nav className="container nav-inner" aria-label="Main navigation">
        <a href="/" className="logo" aria-label="Alshan Rijal home" onClick={(event) => handleNavigation(event, 'home')}>
          <BrandLogo />
        </a>

        <ul className="nav-links" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={homeRoute(item.id)} className={linkClasses(item.id)} onClick={(event) => handleNavigation(event, item.id)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'dark'}
            className="theme-button"
          >
            <span className={`theme-icon${theme === 'dark' ? ' is-dark' : ''}`}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
          </button>

          <a href="/#contact" className="button primary nav-cta" onClick={(event) => handleNavigation(event, 'contact')}>
            Let&apos;s talk
          </a>

          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="theme-button nav-toggle"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div ref={menuRef} id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={homeRoute(item.id)}
                  onClick={(event) => handleNavigation(event, item.id)}
                  className={activeId === item.id ? 'mobile-link active' : 'mobile-link'}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-menu-footer">
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
            <a href="/privacy" onClick={(event) => { event.preventDefault(); setOpen(false); navigate('/privacy') }}>Privacy</a>
          </div>
        </div>
      )}
    </header>
  )
}
