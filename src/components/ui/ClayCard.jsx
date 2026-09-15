export default function ClayCard({
  children,
  className = '',
  hover = true,
  innerClassName = '',
  shadow = 'shadow-clayCard',
  hoverShadow = 'hover:shadow-clayCardHover',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-clay-card border border-white/60 bg-white/70 p-6 ${shadow} backdrop-blur-xl transition-all duration-500 sm:p-8 ${
        hover ? `hover:-translate-y-2 ${hoverShadow}` : ''
      } ${className}`}
    >
      <div className={`relative z-10 flex h-full flex-col ${innerClassName}`}>{children}</div>
    </div>
  )
}
