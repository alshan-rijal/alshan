import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const readJson = (name) => JSON.parse(readFileSync(join(root, 'src', 'data', name), 'utf8'))

const iconSource = readFileSync(join(root, 'src', 'lib', 'icons.jsx'), 'utf8')
const registryBlock = iconSource.slice(
  iconSource.indexOf('iconRegistry = {'),
  iconSource.indexOf('export const getIcon'),
)
const registryKeys = new Set(
  [...registryBlock.matchAll(/^\s*([A-Za-z0-9]+)\s*:/gm)].map((match) => match[1]),
)

const profile = readJson('profile.json')
const projects = readJson('projects.json')
const techStack = readJson('techStack.json')
const education = readJson('education.json')

const used = new Map()
const use = (key, where) => {
  if (!used.has(key)) used.set(key, where)
}

profile.stats.forEach((stat) => use(stat.icon, 'profile.json stats'))
profile.aboutStats.forEach((stat) => use(stat.icon, 'profile.json aboutStats'))
profile.contact.socials.forEach((social) => use(social.icon, 'profile.json socials'))
projects.forEach((project) =>
  project.techStack.forEach((key) => use(key, `projects.json ${project.id}`)),
)
techStack.forEach((group) => {
  use(group.icon, `techStack.json ${group.category} (category)`)
  group.items.forEach((item) => use(item.iconKey, `techStack.json ${group.category}`))
})
education.forEach((item) => use(item.icon, `education.json ${item.role}`))

const missingIcons = [...used.entries()].filter(([key]) => !registryKeys.has(key))

const missingAssets = []
const checkAsset = (path, where) => {
  if (path?.startsWith('/') && !existsSync(join(root, 'public', path))) {
    missingAssets.push(`${path} (${where})`)
  }
}
checkAsset(profile.photo, 'profile.photo')
checkAsset(profile.resume, 'profile.resume')
projects.forEach((project) => checkAsset(project.image, `projects.${project.id}.image`))

console.log(`Icon registry: ${registryKeys.size} icons · referenced: ${used.size}`)

let failed = false

if (missingIcons.length) {
  failed = true
  console.error('\nMissing icon keys (add them to src/lib/icons.jsx):')
  missingIcons.forEach(([key, where]) => console.error(`  - "${key}" used by ${where}`))
}

if (missingAssets.length) {
  failed = true
  console.error('\nMissing asset files (add them under /public):')
  missingAssets.forEach((entry) => console.error(`  - ${entry}`))
}

if (failed) process.exit(1)

console.log('All icon keys and asset paths resolve correctly.')
