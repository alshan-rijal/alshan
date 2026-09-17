const VARIANTS = {
  primary:
    'bg-linear-to-r from-clay-accent-soft to-clay-accent text-white shadow-clayButton hover:shadow-clayButtonHover',
  secondary:
    'bg-clay-surface/80 text-clay-text backdrop-blur-xl shadow-clayButton hover:shadow-clayButtonHover',
  outline:
    'border-2 border-clay-accent/40 bg-clay-surface/40 text-clay-accent backdrop-blur-xl shadow-clayChip hover:bg-clay-surface/70 hover:shadow-clayChipHover',
}

const SIZES = {
  sm: 'h-11 px-5 text-sm',
  md: 'h-14 px-7 text-base',
  lg: 'h-16 px-9 text-lg',
}

export default function ClayButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2.5 rounded-clay-btn font-display font-extrabold tracking-tight transition-all duration-200 hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed disabled:pointer-events-none disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
