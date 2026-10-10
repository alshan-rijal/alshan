import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const paths = [
  join(root, 'index.html'),
  join(root, 'src', 'components', 'BrandLogo.jsx'),
  join(root, 'src', 'components', 'Navbar.jsx'),
  join(root, 'src', 'components', 'Footer.jsx'),
  join(root, 'src', 'pages', 'NotFoundPage.jsx'),
  join(root, 'src', 'pages', 'PrivacyPage.jsx'),
  join(root, 'src', 'styles', 'editorial.css'),
]
const file = paths.map((path) => readFileSync(path, 'utf8')).join('\n')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const banned = [
  'linear-gradient',
  'box-shadow',
  'backdrop-filter',
  'emoji',
  '—',
  '–',
  'Space Grotesk',
  'Inter',
  '@import url',
  'bg-linear-to-r',
  'dist/',
]

const violations = banned.filter((token) => file.includes(token) || html.includes(token))
const expectedPublic = [
  'public/favicon.png',
  'public/favicon-32.png',
  'public/favicon-48.png',
  'public/apple-touch-icon.png',
  'public/icon-192.png',
  'public/icon-512.png',
  'public/site.webmanifest',
  'public/brand/logo.png',
]
const expectedDist = [
  'dist/favicon-32.png',
  'dist/favicon-48.png',
  'dist/apple-touch-icon.png',
  'dist/icon-192.png',
  'dist/icon-512.png',
  'dist/site.webmanifest',
  'dist/brand/logo.png',
]
const missingAssets = expectedPublic.filter((path) => !existsSync(join(root, path)))
const missingDistAssets = expectedDist.filter((path) => !existsSync(join(root, path)))
const oldFiles = ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'logo.svg']
const staleAssets = oldFiles.filter((name) => existsSync(join(root, 'public', name)))
const sourceFiles = readdirSync(join(root, 'src'), { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.(jsx?|css|json)$/.test(entry.name))
  .map((entry) => join(entry.parentPath ?? join(root, 'src'), entry.name))
const sourceHasDist = sourceFiles.some((path) => readFileSync(path, 'utf8').includes('dist/'))

if (violations.length || missingAssets.length || missingDistAssets.length || staleAssets.length || sourceHasDist) {
  if (violations.length) console.error('Banned token matches found:', violations)
  if (missingAssets.length) console.error('Missing public assets:', missingAssets)
  if (missingDistAssets.length) console.error('Missing built assets:', missingDistAssets)
  if (staleAssets.length) console.error('Old public assets remain:', staleAssets)
  if (sourceHasDist) console.error('Source references dist/.')
  process.exit(1)
}

const required = [
  '--bg: #f7f7f5',
  '--accent: #007a70',
  'Alshan Rijal',
  'privacy',
  'og:image',
  'site.webmanifest',
  'brand/logo.png',
]

const missing = required.filter((token) => !(file.includes(token) || html.includes(token)))
if (missing.length) {
  console.error('Missing required tokens:', missing)
  process.exit(1)
}

console.log('UI verification checks passed.')
