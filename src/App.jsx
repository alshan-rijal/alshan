import { Suspense, lazy, useMemo } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import ScrollProgress from './components/ScrollProgress'
import HomePage from './pages/HomePage'
import { ThemeProvider } from './hooks/useTheme'
import { useRouteNavigation } from './hooks/useRouteNavigation'

const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function AppShell({ page }) {
  const currentPage = useMemo(() => {
    if (page === 'privacy') return <PrivacyPage />
    if (page === '404') return <NotFoundPage />
    return <HomePage />
  }, [page])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="site-shell">{currentPage}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}

export default function App() {
  const { location } = useRouteNavigation()
  const page = useMemo(() => {
    if (location.pathname === '/privacy') return 'privacy'
    if (location.pathname === '/404') return '404'
    return 'home'
  }, [location.pathname])

  return (
    <ThemeProvider>
      <Suspense fallback={<div className="loading-shell" /> }>
        <AppShell page={page} />
      </Suspense>
    </ThemeProvider>
  )
}
