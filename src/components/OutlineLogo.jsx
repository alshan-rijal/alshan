export function OutlineLogo({ size = 18, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" aria-hidden="true">
      <path d="M5 19 11.8 5h.6L19 19M7.6 14.2h8.8M9.2 10.8l5.7 4.6" />
    </svg>
  )
}

export function MessageIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5h16v11H9l-5 3v-14Z" />
      <path d="M8 10h8M8 13h5" strokeLinecap="round" />
    </svg>
  )
}
