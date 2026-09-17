import About from './components/About'
import BackgroundBlobs from './components/BackgroundBlobs'
import Contact from './components/Contact'
import Education from './components/Education'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Skills from './components/Skills'
import { ThemeProvider } from './hooks/useTheme'

export default function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <BackgroundBlobs />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
