import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const requiredSections = ['home', 'about', 'skills', 'projects', 'education', 'contact']
const requiredSnippets = ['KamKhoj', 'TensorFlow', 'Download CV', 'Send']
const requiredAssets = ['public/favicon.png', 'public/brand/logo.png', 'public/site.webmanifest']

for (const asset of requiredAssets) {
  if (!existsSync(join(root, asset))) throw new Error(`Missing required asset: ${asset}`)
}

if (readFileSync(join(root, 'index.html'), 'utf8').includes('dist/')) {
  throw new Error('index.html must not reference dist/.')
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const [{ default: Navbar }, { default: Footer }, { default: HomePage }, { ThemeProvider }] = await Promise.all([
    server.ssrLoadModule('/src/components/Navbar.jsx'),
    server.ssrLoadModule('/src/components/Footer.jsx'),
    server.ssrLoadModule('/src/pages/HomePage.jsx'),
    server.ssrLoadModule('/src/hooks/useTheme.js'),
  ])
  const html = renderToString(
    createElement(ThemeProvider, null,
      createElement('div', null,
        createElement(Navbar),
        createElement(HomePage),
        createElement(Footer),
      ),
    ),
  )

  const missingSections = requiredSections.filter((id) => !html.includes(`id="${id}"`))
  if (missingSections.length) {
    throw new Error(`Missing sections in render: ${missingSections.join(', ')}`)
  }

  const missingSnippets = requiredSnippets.filter((snippet) => !html.includes(snippet))
  if (missingSnippets.length) {
    throw new Error(`Missing content in render: ${missingSnippets.join(', ')}`)
  }

  if (!html.includes('brand/logo-32.png') || !html.includes('brand/logo-32-dark.png')) {
    throw new Error('Rendered header/footer logo variants are missing.')
  }
  if (!html.includes('Open a conversation') && !html.includes('contact')) {
    throw new Error('Contact surface is missing.')
  }

  console.log(`Smoke render OK - ${html.length} chars, all sections, data and logo references present.`)
} finally {
  await server.close()
}
