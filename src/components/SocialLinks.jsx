import profile from '../data/profile.json'

function SocialIcon({ platform }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round', strokeLinecap: 'round', vectorEffect: 'non-scaling-stroke' }
  if (platform === 'GitHub') return <svg viewBox="0 0 24 24" {...common}><path d="M9 19c-4 .8-4-2-5-2m10 4v-3.9c0-1 .1-1.4-.5-2.1 1.7-.2 3.5-.8 3.5-4A3.1 3.1 0 0 0 16 8.9a2.9 2.9 0 0 0-.1-2.1s-1.1-.4-3.2 1.2a11 11 0 0 0-5.4 0C5.2 6.4 4.1 6.8 4.1 6.8A2.9 2.9 0 0 0 4 8.9a3.1 3.1 0 0 0-1 2.2c0 3.2 1.8 3.8 3.5 4-.6.6-.6 1-.5 2.1V21" /></svg>
  if (platform === 'Instagram') return <svg viewBox="0 0 24 24" {...common}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><path d="M17.5 6.5h.01" /></svg>
  if (platform === 'Facebook') return <svg viewBox="0 0 24 24" {...common}><path d="M14 20v-7h2.5l.5-3H14V8.2c0-.9.3-1.7 1.7-1.7H17V3.8c-.6-.1-1.3-.2-2.1-.2-2.1 0-3.5 1.3-3.5 3.7V10H9v3h2.4v7" /></svg>
  return <svg viewBox="0 0 24 24" {...common}><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="m4 6 8 6 8-6" /></svg>
}

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`social-list ${className}`}>
      {profile.contact.socials.map((social) => (
        <a
          key={social.platform}
          href={social.url}
          className="social-link"
          aria-label={social.platform}
          target={social.url.startsWith('http') ? '_blank' : undefined}
          rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          <SocialIcon platform={social.platform} />
        </a>
      ))}
    </div>
  )
}
