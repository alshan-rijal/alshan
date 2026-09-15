import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const REQUIRED_SECTIONS = ['home', 'about', 'skills', 'projects', 'education', 'contact']
const REQUIRED_SNIPPETS = ['KamKhoj', 'TensorFlow', 'Download CV', 'Send Message']

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const html = renderToString(createElement(App))

  const missingSections = REQUIRED_SECTIONS.filter((id) => !html.includes(`id="${id}"`))
  if (missingSections.length) {
    throw new Error(`Missing sections in render: ${missingSections.join(', ')}`)
  }

  const missingSnippets = REQUIRED_SNIPPETS.filter((snippet) => !html.includes(snippet))
  if (missingSnippets.length) {
    throw new Error(`Missing content in render: ${missingSnippets.join(', ')}`)
  }

  console.log(`Smoke render OK — ${html.length} chars, all sections and data present.`)
} finally {
  await server.close()
}
