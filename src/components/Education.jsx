import education from '../data/education.json'
import ClayCard from './ui/ClayCard'
import IconOrb from './ui/IconOrb'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Education() {
  return (
    <section id="education" className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Education"
            title="Where I've been"
            highlight="learning."
            subtitle="My academic path through computer engineering, AI and cloud computing — the foundation for everything I build."
          />
        </Reveal>

        <div className="relative mt-16">
          <ol className="flex flex-col gap-8">
            {education.map((item, index) => (
              <li key={`${item.role}-${item.org}`} className="relative pl-20 sm:pl-24">
                <span className="absolute left-0 top-6 z-10">
                  <IconOrb icon={item.icon} tone={item.tone} />
                </span>
                {index < education.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-7 top-20 w-1 translate-y-8 rounded-full bg-linear-to-b from-clay-accent/25 via-clay-pink/25 to-clay-sky/25"
                  />
                )}

                <Reveal delay={index * 80}>
                  <ClayCard>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-extrabold tracking-tight text-clay-text sm:text-2xl">
                        {item.role}
                      </h3>
                      <span className="rounded-full bg-clay-recess px-3.5 py-1.5 text-xs font-bold text-clay-muted shadow-clayPressedSoft">
                        {item.period}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-bold text-clay-accent">{item.org}</p>

                    <p className="mt-4 text-base font-medium leading-relaxed text-clay-muted">
                      {item.description}
                    </p>
                  </ClayCard>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
