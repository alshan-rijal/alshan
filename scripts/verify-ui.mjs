import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const sourceEntries = readdirSync(join(root, 'src'), { recursive: true, withFileTypes: true })
const paths = [
  join(root, 'index.html'),
  ...sourceEntries
    .filter((entry) => entry.isFile() && /\.(jsx?|css|json)$/.test(entry.name))
    .map((entry) => join(entry.parentPath ?? join(root, 'src'), entry.name)),
]
const file = paths.map((path) => readFileSync(path, 'utf8')).join('\n')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const faviconLinks = [...html.matchAll(/<link[^>]+(?:rel="icon"|rel="apple-touch-icon")[^>]*>/g)].map(([link]) => link)
const banned = [
  'linear-gradient',
  'box-shadow',
  'backdrop-filter',
  'blur',
  'glow',
  'purple',
  'emoji',
  '—',
  '–',
  'Space Grotesk',
  'font-family: Inter',
  '@import url',
  'bg-linear-to-r',
  'dist/',
]

const violations = banned.filter((token) => file.includes(token) || html.includes(token))
const expectedPublic = [
  'public/mainfav.png',
  'public/site.webmanifest',
  'public/brand/logo.png',
  'public/fonts/poppins-400.woff2',
  'public/fonts/poppins-600.woff2',
  'public/fonts/syne-500.woff2',
  'public/fonts/syne-800.woff2',
]
const expectedDist = [
  'dist/mainfav.png',
  'dist/site.webmanifest',
  'dist/brand/logo.png',
]
const missingAssets = expectedPublic.filter((path) => !existsSync(join(root, path)))
const missingDistAssets = expectedDist.filter((path) => !existsSync(join(root, path)))
const oldFiles = ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'logo.svg', 'favicon.png', 'favicon-light-32.png', 'favicon-light-48.png', 'favicon-dark-32.png', 'favicon-dark-48.png', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']
const staleAssets = oldFiles.filter((name) => existsSync(join(root, 'public', name)))
const sourceFiles = paths.filter((path) => path.includes(`${join(root, 'src')}${process.platform === 'win32' ? '\\' : '/'}`))
const sourceHasDist = sourceFiles.some((path) => readFileSync(path, 'utf8').includes('dist/'))
const invalidFaviconLinks = faviconLinks.filter((link) => !link.includes('/mainfav.png?v=6'))

if (violations.length || missingAssets.length || missingDistAssets.length || staleAssets.length || sourceHasDist || faviconLinks.length !== 2 || invalidFaviconLinks.length) {
  if (violations.length) console.error('Banned token matches found:', violations)
  if (missingAssets.length) console.error('Missing public assets:', missingAssets)
  if (missingDistAssets.length) console.error('Missing built assets:', missingDistAssets)
  if (staleAssets.length) console.error('Old public assets remain:', staleAssets)
  if (sourceHasDist) console.error('Source references dist/.')
  if (faviconLinks.length !== 2 || invalidFaviconLinks.length) console.error('Favicon links must contain only mainfav.png?v=6.')
  process.exit(1)
}

const required = [
  '--bg: #f7f7f5',
  '--accent: #4d6b00',
  '--accent: #c6f432',
  'Alshan Rijal',
  'privacy',
  'og:image',
  'site.webmanifest',
  'brand/logo.png',
  'fonts/poppins-400.woff2',
  'fonts/poppins-600.woff2',
  'fonts/syne-500.woff2',
  'fonts/syne-800.woff2',
  'tools-layout',
  'Message',
  'project-preview',
  'mainfav.png?v=6',
]

const missing = required.filter((token) => !(file.includes(token) || html.includes(token)))
if (missing.length) {
  console.error('Missing required tokens:', missing)
  process.exit(1)
}

console.log('UI verification checks passed.')
