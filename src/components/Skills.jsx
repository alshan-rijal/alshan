import { createElement } from 'react'
import techStack from '../data/techStack.json'
import { getIcon, getIconColor } from '../lib/icons'
import ClayCard from './ui/ClayCard'
import IconOrb from './ui/IconOrb'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

function TechChip({ item }) {
  const Icon = getIcon(item.iconKey)

  return (
    <span className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-clayChip transition-all duration-300 hover:-translate-y-1 hover:shadow-clayChipHover">
      {createElement(Icon, {
        'aria-hidden': true,
        className: 'text-xl',
        style: { color: getIconColor(item.iconKey) },
      })}
      <span className="text-sm font-bold text-clay-text">{item.name}</span>
    </span>
  )
}

export default function Skills() {
  const lastIsOdd = techStack.length % 2 === 1

  return (
    <section id="skills" className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Tech stack"
            title="Tools I shape"
            highlight="products with."
            subtitle="A curated toolbox spanning the frontend, backend and machine learning — grouped the way I actually use it."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {techStack.map((group, index) => {
            const centerLast = lastIsOdd && index === techStack.length - 1

            return (
              <Reveal
                key={group.category}
                delay={index * 70}
                className={`h-full ${centerLast ? 'lg:col-span-2 lg:mx-auto lg:w-[calc(50%_-_0.75rem)]' : ''}`}
              >
                <ClayCard className="h-full">
                  <div className="flex items-center gap-4">
                    <IconOrb iconKey={group.icon} />
                    <h3 className="font-display text-xl font-extrabold tracking-tight text-clay-text sm:text-2xl">
                      {group.category}
                    </h3>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {group.items.map((item) => (
                      <TechChip key={item.name} item={item} />
                    ))}
                  </div>
                </ClayCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
