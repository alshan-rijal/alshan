import { createElement } from 'react'
import { clayOrbShadow, toneGradient } from '../../lib/clay'
import { getIcon } from '../../lib/icons'

const SIZES = {
  sm: 'h-10 w-10 text-lg',
  md: 'h-14 w-14 text-2xl',
  lg: 'h-16 w-16 text-3xl',
}

export default function IconOrb({
  icon,
  tone = 'violet',
  size = 'md',
  shape = 'circle',
  breathe = false,
  className = '',
}) {
  const Icon = getIcon(icon)

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center text-white ${
        shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
      } ${SIZES[size]} ${breathe ? 'animate-clay-breathe' : ''} ${className}`}
      style={{ ...toneGradient(tone), ...clayOrbShadow(tone) }}
    >
      {createElement(Icon, { 'aria-hidden': true })}
    </span>
  )
}
