import { createContext, createElement, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-theme'
const ThemeContext = createContext(null)

const getSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  let stored = null
  try {
    stored = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    stored = null
  }
  return stored === 'dark' || stored === 'light' ? stored : getSystemTheme()
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B0B0B' : '#F7F7F5')
    }
  }, [theme])

  useEffect(() => {
    let stored = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    if (stored) return undefined

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setTheme(event.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = (source) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
    } catch {
      // Theme still updates when storage is unavailable.
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => setTheme(nextTheme)

    if (typeof document.startViewTransition === 'function' && !reduceMotion) {
      const rect = source?.currentTarget?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
      document.documentElement.style.setProperty('--theme-x', `${x}px`)
      document.documentElement.style.setProperty('--theme-y', `${y}px`)
      document.startViewTransition(update)
      return
    }

    document.documentElement.classList.add('theme-transition')
    update()
    window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), reduceMotion ? 0 : 350)
  }

  return createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, children)
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}