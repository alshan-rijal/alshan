import { useEffect, useRef, useState } from 'react'
import { OutlineLogo } from './OutlineLogo'

function linksFor(project) {
  return [
    project.liveUrl && project.liveUrl !== '#' ? { label: 'Live demo', href: project.liveUrl } : null,
    project.githubUrl && project.githubUrl !== '#' ? { label: 'Source', href: project.githubUrl } : null,
  ].filter(Boolean)
}

export default function ProjectList({ projects }) {
  const [active, setActive] = useState(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const listRef = useRef(null)
  const frameRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const positionRef = useRef({ x: 0, y: 0 })
  const previewRef = useRef(null)

  useEffect(() => () => window.cancelAnimationFrame(frameRef.current), [])

  const movePreview = (event) => {
    targetRef.current = { x: event.clientX + 24, y: event.clientY + 24 }
    if (frameRef.current) return
    const tick = () => {
      const current = positionRef.current
      const target = targetRef.current
      current.x += (target.x - current.x) * 0.18
      current.y += (target.y - current.y) * 0.18
      setPointer({ x: current.x, y: current.y })
      frameRef.current = window.requestAnimationFrame(tick)
    }
    frameRef.current = window.requestAnimationFrame(tick)
  }

  const stopPreview = () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    setActive(null)
  }

  const preload = () => {
    projects.forEach((project) => {
      if (project.image) {
        const image = new Image()
        image.src = project.image
      }
    })
  }

  return (
    <>
      <div
        ref={listRef}
        className="project-list"
        onPointerMove={movePreview}
        onPointerEnter={preload}
        onPointerLeave={stopPreview}
      >
        {projects.map((project, index) => {
          const links = linksFor(project)
          const expanded = active === project.id
          return (
            <article
              key={`${project.id}-${index}`}
              className={`project-row${expanded ? ' expanded' : ''}`}
              tabIndex="0"
              onFocus={() => setActive(project.id)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) stopPreview()
              }}
              onClick={() => {
                if (window.matchMedia('(pointer: coarse)').matches) setActive(expanded ? null : project.id)
              }}
            >
              <div className="project-meta">
                <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
              <div className="project-stack">{project.techStack.join(' / ')}</div>
              <div className="project-links">
                {links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                    <OutlineLogo />
                    {link.label}
                  </a>
                ))}
              </div>
              <span className="marker" aria-hidden="true" />
            </article>
          )
        })}
      </div>
      {active && (
        <div
          ref={previewRef}
          className="project-preview"
          style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }}
          aria-hidden="true"
        >
          {projects.find((project) => project.id === active)?.image ? (
            <img src={projects.find((project) => project.id === active).image} alt="" width="640" height="480" />
          ) : null}
        </div>
      )}
    </>
  )
}
