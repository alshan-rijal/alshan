import { FiArrowRight, FiDownload } from 'react-icons/fi'
import profile from '../data/profile.json'
import { getIcon } from '../lib/icons'
import ClayButton from './ui/ClayButton'
import IconOrb from './ui/IconOrb'

const BADGE_MOTION = [
  { float: 'animate-clay-float', duration: '6s', delay: '0s' },
  { float: 'animate-clay-float-delayed', duration: '7s', delay: '0.9s' },
  { float: 'animate-clay-float-slow', duration: '9s', delay: '1.8s' },
]
const BADGE_POSITIONS = [
  'top-6 -left-3 sm:top-8 sm:-left-10',
  'top-1/2 -right-3 sm:-right-8',
  '-bottom-6 left-1/2 -translate-x-1/2',
]

export default function Hero() {
  const { hero } = profile

  return (
    <section
      id="home"
      className="relative overflow-x-clip px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold text-clay-muted shadow-clayChip backdrop-blur-xl">
            <span className="h-2.5 w-2.5 animate-clay-breathe rounded-full bg-clay-emerald" />
            {hero.greeting}
          </span>

          <h1 className="font-display mt-8 text-4xl font-black leading-[1.1] tracking-tight text-clay-text sm:text-5xl md:text-6xl lg:text-7xl">
            {hero.headlinePrefix}{' '}
            <span className="bg-linear-to-r from-clay-accent via-clay-pink to-clay-sky bg-clip-text text-transparent">
              {hero.headlineHighlight}
            </span>{' '}
            {hero.headlineSuffix}
          </h1>

          <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-clay-muted sm:text-lg">
            {hero.subline}
          </p>

          <div className="mt-11 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <ClayButton href="#projects" className="w-full sm:w-auto">
              View Projects
              <FiArrowRight aria-hidden="true" />
            </ClayButton>
            <ClayButton
              href={profile.resume}
              download
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <FiDownload aria-hidden="true" />
              Download CV
            </ClayButton>
          </div>

          <div className="mt-11 flex items-center gap-3">
            {profile.contact.socials.map((social) => {
              const Icon = getIcon(social.icon)
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  aria-label={social.platform}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/80 text-xl text-clay-accent shadow-clayChip transition-all duration-200 hover:-translate-y-1 hover:shadow-clayChipHover active:scale-90 active:shadow-clayPressed"
                >
                  <Icon aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md sm:max-w-lg">
          <div
            aria-hidden="true"
            className="absolute -inset-10 -z-10 rounded-full bg-clay-accent/15 blur-3xl"
          />

          <div className="animate-clay-float-hero rounded-clay-container-lg border border-white/70 bg-white/60 p-4 shadow-clayDeep backdrop-blur-xl sm:p-5">
            <div className="overflow-hidden rounded-[44px] bg-clay-recess">
              <img
                src={profile.photo}
                alt={`${profile.name} — ${profile.role}`}
                className="aspect-[1/1] w-full object-cover object-center"
              />
            </div>
          </div>

          {profile.stats.map((stat, index) => {
            const motion = BADGE_MOTION[index % BADGE_MOTION.length]
            return (
              <div
                key={stat.label}
                className={`absolute ${BADGE_POSITIONS[index % BADGE_POSITIONS.length]}`}
              >
                <div
                  className={motion.float}
                  style={{ animationDuration: motion.duration, animationDelay: motion.delay }}
                >
                  <div className="flex items-center gap-3.5 rounded-clay-pill border border-white/70 bg-white/85 py-4 pl-4 pr-7 shadow-clayCard backdrop-blur-xl">
                    <IconOrb icon={stat.icon} tone={stat.tone} size="md" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-display text-2xl font-black text-clay-text">
                        {stat.value}
                      </span>
                      <span className="text-sm font-bold uppercase tracking-wide text-clay-muted">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
