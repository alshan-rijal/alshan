export default function SectionHeading({ eyebrow, title, highlight, subtitle, align = 'center' }) {
  const alignment =
    align === 'left' ? 'items-start text-left' : 'items-center text-center'

  return (
    <div className={`flex flex-col gap-5 ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-[0.22em] text-clay-accent uppercase shadow-clayChip backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-linear-to-br from-clay-accent-soft to-clay-pink" />
          {eyebrow}
        </span>
      )}

      <h2 className="font-display max-w-3xl text-3xl font-black tracking-tight text-clay-text sm:text-4xl md:text-5xl">
        {title}{' '}
        {highlight && (
          <span className="text-clay-accent bg-linear-to-r from-clay-accent to-clay-pink bg-clip-text md:text-transparent">
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className="max-w-2xl text-base font-medium leading-relaxed text-clay-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
