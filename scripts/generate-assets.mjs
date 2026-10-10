import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const publicDir = join(root, 'public')
const faviconSource = join(publicDir, 'favicon.png')
const logoSource = join(publicDir, 'brand', 'logo.png')
const light = '#F7F7F5'
const dark = '#0B0B0B'

await mkdir(join(publicDir, 'brand'), { recursive: true })
await mkdir(join(publicDir, 'og'), { recursive: true })

const writeAsset = async (source, target, width, options = {}) => {
  await mkdir(dirname(target), { recursive: true })
  const image = sharp(source).resize({
    width,
    height: options.height ?? width,
    fit: options.fit ?? 'contain',
    position: 'centre',
    background: options.background,
  })

  if (options.format === 'webp') {
    await image.webp({ quality: 82, effort: 6 }).toFile(target)
  } else {
    await image.png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(target)
  }
}

const prepareFavicon = async (source) => {
  const trimmed = sharp(source).trim()
  const buffer = await trimmed.png().toBuffer()
  const metadata = await sharp(buffer).metadata()
  const canvas = Math.max(metadata.width, metadata.height)
  const inner = Math.round(canvas / 1.16)
  const mark = await sharp(buffer).resize(inner, inner, { fit: 'contain' }).png().toBuffer()
  return sharp({
    create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{ input: mark, gravity: 'centre' }]).png().toBuffer()
}

const recolorFavicon = async (source, color) => {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const rgb = [Number.parseInt(color.slice(1, 3), 16), Number.parseInt(color.slice(3, 5), 16), Number.parseInt(color.slice(5, 7), 16)]
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) continue
    data[index] = rgb[0]
    data[index + 1] = rgb[1]
    data[index + 2] = rgb[2]
  }
  return sharp(data, { raw: info }).png().toBuffer()
}

const transparentIcon = async (source, target, size) => {
  await sharp(source)
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(target)
}

const tile = async (source, target, size, background) => {
  const inner = Math.round(size * 0.76)
  const resized = await sharp(source).resize(inner, inner, { fit: 'contain' }).png().toBuffer()
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: resized, gravity: 'centre' }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(target)
}

const preparedFavicon = await prepareFavicon(faviconSource)
await writeFile(faviconSource, preparedFavicon)
const lightFavicon = preparedFavicon
const darkFavicon = await recolorFavicon(preparedFavicon, '#F4F4F2')
const fallbackTile = async (source, target, size) => {
  const inner = Math.round(size * 0.84)
  const mark = await sharp(source).resize(inner, inner, { fit: 'contain' }).png().toBuffer()
  const radius = Math.round(size * 0.18)
  const background = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#F4F4F2"/></svg>`)
  await sharp(background).composite([{ input: mark, gravity: 'centre' }]).png({ compressionLevel: 9, palette: true }).toFile(target)
}
for (const size of [32, 48]) {
  await sharp(lightFavicon).resize(size, size, { fit: 'contain' }).png({ compressionLevel: 9, palette: true }).toFile(join(publicDir, `favicon-light-${size}.png`))
  await sharp(darkFavicon).resize(size, size, { fit: 'contain' }).png({ compressionLevel: 9, palette: true }).toFile(join(publicDir, `favicon-dark-${size}.png`))
  await fallbackTile(lightFavicon, join(publicDir, `favicon-${size}.png`), size)
}
for (const [size, name] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  await tile(lightFavicon, join(publicDir, name), size, light)
}

const logoMetadata = await sharp(logoSource).metadata()
const logoBuffer = await sharp(logoSource).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const recolorLogo = async (color, target) => {
  const pixels = logoBuffer.data
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue
    pixels[index] = Number.parseInt(color.slice(1, 3), 16)
    pixels[index + 1] = Number.parseInt(color.slice(3, 5), 16)
    pixels[index + 2] = Number.parseInt(color.slice(5, 7), 16)
  }
  await sharp(pixels, {
    raw: { width: logoMetadata.width, height: logoMetadata.height, channels: 4 },
  }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(target)
}

await recolorLogo(dark, join(publicDir, 'brand', 'logo-on-light.png'))
await recolorLogo(light, join(publicDir, 'brand', 'logo-on-dark.png'))

for (const [name, size] of [['logo-24', 24], ['logo-28', 28], ['logo-32', 32]]) {
  for (const [scale, suffix] of [[1, ''], [2, '@2x'], [3, '@3x']]) {
    await writeAsset(join(publicDir, 'brand', 'logo-on-light.png'), join(publicDir, 'brand', `${name}${suffix}.png`), size * scale)
    await writeAsset(join(publicDir, 'brand', 'logo-on-dark.png'), join(publicDir, 'brand', `${name}${suffix}-dark.png`), size * scale)
    await writeAsset(join(publicDir, 'brand', `${name}${suffix}.png`), join(publicDir, 'brand', `${name}${suffix}.webp`), size * scale, { format: 'webp' })
    await writeAsset(join(publicDir, 'brand', `${name}${suffix}-dark.png`), join(publicDir, 'brand', `${name}${suffix}-dark.webp`), size * scale, { format: 'webp' })
  }
}

const logoForOg = await sharp(join(publicDir, 'brand', 'logo-on-dark.png')).resize(130, 130, { fit: 'contain' }).png().toBuffer()
const ogBase = sharp({
  create: { width: 1200, height: 630, channels: 4, background: dark },
})
  .composite([{ input: logoForOg, left: 60, top: 60 }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
await ogBase.toFile(join(publicDir, 'og.png'))
await sharp(join(publicDir, 'og.png')).resize(600, 600, { fit: 'cover' }).png({ compressionLevel: 9, palette: true }).toFile(join(publicDir, 'og', 'og-600.png'))

await writeFile(join(publicDir, 'site.webmanifest'), JSON.stringify({
  name: 'Alshan Rijal',
  short_name: 'Alshan',
  start_url: '/',
  display: 'standalone',
  theme_color: dark,
  background_color: dark,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2) + '\n')

console.log('Generated favicon, app icons, responsive logo assets, manifest and social preview.')
