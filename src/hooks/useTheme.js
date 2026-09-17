import { createContext, createElement, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-theme'
const ThemeContext = createContext(null)

const getSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
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
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#17151d' : '#f4f1fa')
    }
  }, [theme])

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY)) return undefined

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setTheme(event.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
  }

  return createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, children)
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}