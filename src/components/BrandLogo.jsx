const logoSources = {
  light: '/brand/logo-32.webp 32w, /brand/logo-32@2x.webp 64w, /brand/logo-32@3x.webp 96w',
  dark: '/brand/logo-32-dark.webp 32w, /brand/logo-32@2x-dark.webp 64w, /brand/logo-32@3x-dark.webp 96w',
}

export default function BrandLogo() {
  return (
    <span className="brand-logo">
      <picture className="brand-logo-picture brand-logo-light">
        <source type="image/webp" srcSet={logoSources.light} sizes="32px" />
        <img src="/brand/logo-32.png" srcSet="/brand/logo-32.png 32w, /brand/logo-32@2x.png 64w, /brand/logo-32@3x.png 96w" sizes="32px" width="32" height="32" alt="" loading="eager" decoding="async" />
      </picture>
      <picture className="brand-logo-picture brand-logo-dark">
        <source type="image/webp" srcSet={logoSources.dark} sizes="32px" />
        <img src="/brand/logo-32-dark.png" srcSet="/brand/logo-32-dark.png 32w, /brand/logo-32@2x-dark.png 64w, /brand/logo-32@3x-dark.png 96w" sizes="32px" width="32" height="32" alt="" loading="eager" decoding="async" />
      </picture>
      <span className="brand-wordmark">Alshan Rijal</span>
    </span>
  )
}
