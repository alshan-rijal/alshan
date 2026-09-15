import { useState } from 'react'
import profile from '../data/profile.json'
import { getIcon, getIconColor } from '../lib/icons'
import ClayCard from './ui/ClayCard'
import IconOrb from './ui/IconOrb'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const INITIALS = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')

const renderHighlight = (text) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-extrabold text-clay-text">
        {part}
      </strong>
    ) : (
      part
    ),
  )

function Avatar() {
  const [failed, setFailed] = useState(false)

  return (
    <span className="font-display flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-clay-accent-soft to-clay-accent text-4xl font-black text-white shadow-clayPill lg:h-40 lg:w-40 lg:text-5xl">
      {profile.avatar && !failed ? (
        <img
          src={profile.avatar}
          alt={profile.name}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        INITIALS
      )}
    </span>
  )
}

export default function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="About me"
            title="Soft edges,"
            highlight="sharp thinking."
            subtitle={profile.tagline}
          />
        </Reveal>

        <Reveal className="mt-14">
          <ClayCard
            innerClassName="gap-7"
            shadow="shadow-clayCardStrong"
            hoverShadow="hover:shadow-clayCardStrongHover"
          >
            <div className="grid gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] lg:gap-10">
              <div className="flex flex-col items-center gap-4 self-center text-center lg:items-start lg:text-left">
                <Avatar />
                <div>
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-clay-text">
                    {profile.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-clay-muted">{profile.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <p className="text-base font-medium leading-relaxed text-clay-muted sm:text-lg">
                  {renderHighlight(profile.bio)}
                </p>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {profile.focusAreas.map((area) => {
                    const Icon = getIcon(area.icon)
                    return (
                      <li
                        key={area.label}
                        className="flex h-14 items-center gap-3 rounded-clay-pill border border-white/60 bg-white px-4 text-sm font-bold text-clay-muted shadow-clayPill"
                      >
                        <Icon
                          aria-hidden="true"
                          className="shrink-0 text-base"
                          style={{ color: getIconColor(area.icon) }}
                        />
                        {area.label}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </ClayCard>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {profile.aboutStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} className="h-full">
              <ClayCard
                className="h-full"
                innerClassName="items-center justify-center gap-3 text-center"
              >
                <IconOrb icon={stat.icon} tone={stat.tone} size="lg" breathe />
                <span className="font-display text-3xl font-black text-clay-text">
                  {stat.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-clay-muted">
                  {stat.label}
                </span>
              </ClayCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
