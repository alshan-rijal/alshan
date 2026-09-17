import { useCallback, useEffect, useRef, useState } from 'react'
import { FiExternalLink, FiGithub, FiX } from 'react-icons/fi'
import projects from '../data/projects.json'
import techStack from '../data/techStack.json'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { getIcon, getIconColor } from '../lib/icons'
import ClayButton from './ui/ClayButton'
import ClayCard from './ui/ClayCard'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const AUTO_SCROLL_SPEED = 48
const MODAL_TRANSITION_MS = 400
const DRAG_THRESHOLD = 4
const TECH_NAMES = Object.fromEntries(
  techStack.flatMap((group) => group.items.map((item) => [item.iconKey, item.name])),
)

function isVisibleRect(rect) {
  return (
    rect &&
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight
  )
}

function getOriginTransform(origin, target) {
  const originCenterX = origin.left + origin.width / 2
  const originCenterY = origin.top + origin.height / 2
  const targetCenterX = target.left + target.width / 2
  const targetCenterY = target.top + target.height / 2
  const scaleX = Math.max(0.1, origin.width / target.width)
  const scaleY = Math.max(0.1, origin.height / target.height)

  return `translate(${originCenterX - targetCenterX}px, ${originCenterY - targetCenterY}px) scale(${scaleX}, ${scaleY})`
}

function ProjectCard({ project, duplicate = false, onOpen }) {
  return (
    <article
      role="button"
      tabIndex={duplicate ? -1 : 0}
      aria-hidden={duplicate || undefined}
      aria-label={`View ${project.title} details`}
      onClick={(event) => {
        if (event.target.closest('a')) return
        onOpen(project, event.currentTarget)
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onOpen(project, event.currentTarget)
      }}
      className="w-[300px] shrink-0 cursor-pointer rounded-clay-card outline-none focus-visible:ring-4 focus-visible:ring-clay-accent/30 sm:w-[380px]"
    >
      <ClayCard className="h-full" innerClassName="gap-4">
        <div className="relative overflow-hidden rounded-[24px] bg-clay-recess shadow-clayPressedSoft">
          <img
            src={project.image}
            alt={`${project.title} project preview`}
            loading="lazy"
            draggable={false}
            className="aspect-[16/10] w-full object-cover"
          />
          {project.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-linear-to-r from-clay-amber to-clay-pink px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-clayChip">
              Featured
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-extrabold tracking-tight text-clay-text sm:text-2xl">
          {project.title}
        </h3>

        <p className="text-sm font-medium leading-relaxed text-clay-muted">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {project.techStack.map((key) => {
            const Icon = getIcon(key)
            return (
              <span
                key={key}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-clay-border/70 bg-clay-surface/80 text-base shadow-clayChip"
                style={{ color: getIconColor(key) }}
              >
                <Icon aria-hidden="true" />
              </span>
            )
          })}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <ClayButton
            size="sm"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FiExternalLink aria-hidden="true" />
            Live Demo
          </ClayButton>
          <ClayButton
            size="sm"
            variant="secondary"
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FiGithub aria-hidden="true" />
            Code
          </ClayButton>
        </div>
      </ClayCard>
    </article>
  )
}

function ProjectModal({
  project,
  closing,
  originRect,
  closeOriginRect,
  reducedMotion,
  onClose,
}) {
  const closeButtonRef = useRef(null)
  const modalRef = useRef(null)
  const [active, setActive] = useState(reducedMotion)

  useEffect(() => {
    closeButtonRef.current?.focus()
    if (reducedMotion || !modalRef.current || !isVisibleRect(originRect)) {
      setActive(true)
      return undefined
    }

    const modal = modalRef.current
    const targetRect = modal.getBoundingClientRect()
    modal.style.transform = getOriginTransform(originRect, targetRect)
    modal.style.opacity = '0.72'
    const frame = requestAnimationFrame(() => {
      modal.style.transform = 'translate(0, 0) scale(1, 1)'
      modal.style.opacity = '1'
      setActive(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [originRect, reducedMotion])

  useEffect(() => {
    if (!closing || !modalRef.current) return undefined
    const modal = modalRef.current
    if (reducedMotion || !isVisibleRect(closeOriginRect)) {
      modal.style.transform = 'translate(0, 0) scale(1, 1)'
      modal.style.opacity = '0'
      return undefined
    }

    modal.style.transform = getOriginTransform(closeOriginRect, modal.getBoundingClientRect())
    modal.style.opacity = '0.72'
    return undefined
  }, [closeOriginRect, closing, reducedMotion])

  const visible = active && !closing
  const detailMotion = reducedMotion
    ? visible
      ? 'opacity-100'
      : 'opacity-0'
    : visible
      ? 'translate-y-0 opacity-100'
      : 'translate-y-2 opacity-0'

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-clay-text/25 p-4 backdrop-blur-md transition-opacity duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} details`}
        onClick={(event) => event.stopPropagation()}
        className={`scrollbar-none relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-clay-container border border-clay-border/70 bg-clay-surface/90 p-6 shadow-clayDeep backdrop-blur-xl transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8 ${
          reducedMotion
            ? visible
              ? 'opacity-100'
              : 'opacity-0'
            : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          ref={closeButtonRef}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-clay-border/70 bg-clay-surface/90 text-lg text-clay-muted shadow-clayChip transition-all duration-200 hover:-translate-y-0.5 hover:text-clay-text hover:shadow-clayChipHover active:scale-90 active:shadow-clayPressed"
        >
          <FiX aria-hidden="true" />
        </button>

        <div
          className={`overflow-hidden rounded-[24px] bg-clay-recess shadow-clayPressedSoft transition-[opacity,transform] duration-[260ms] ease-out delay-75 ${detailMotion}`}
        >
          <img
            src={project.image}
            alt={`${project.title} project preview`}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <div
          className={`mt-6 flex flex-wrap items-center gap-3 transition-[opacity,transform] duration-[260ms] ease-out delay-100 ${detailMotion}`}
        >
          <h3 className="font-display text-2xl font-black tracking-tight text-clay-text sm:text-3xl">
            {project.title}
          </h3>
          {project.featured && (
            <span className="rounded-full bg-linear-to-r from-clay-amber to-clay-pink px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-clayChip">
              Featured
            </span>
          )}
        </div>

        <p
          className={`mt-3 text-base font-medium leading-relaxed text-clay-muted transition-[opacity,transform] duration-[260ms] ease-out delay-150 ${detailMotion}`}
        >
          {project.description}
        </p>

        <div
          className={`mt-5 flex flex-wrap gap-2.5 transition-[opacity,transform] duration-[260ms] ease-out delay-150 ${detailMotion}`}
        >
          {project.techStack.map((key) => {
            const Icon = getIcon(key)
            return (
              <span
                key={key}
                className="flex items-center gap-2.5 rounded-2xl border border-clay-border/70 bg-clay-surface/80 px-3.5 py-2.5 shadow-clayChip"
              >
                <Icon
                  aria-hidden="true"
                  className="text-lg"
                  style={{ color: getIconColor(key) }}
                />
                <span className="text-sm font-bold text-clay-text">{TECH_NAMES[key] ?? key}</span>
              </span>
            )
          })}
        </div>

        <div
          className={`mt-7 flex flex-wrap gap-3 transition-[opacity,transform] duration-[260ms] ease-out delay-200 ${detailMotion}`}
        >
          <ClayButton href={project.liveUrl} target="_blank" rel="noreferrer">
            <FiExternalLink aria-hidden="true" />
            Live Demo
          </ClayButton>
          <ClayButton
            variant="secondary"
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FiGithub aria-hidden="true" />
            Code
          </ClayButton>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const reducedMotion = useReducedMotion()
  const viewportRef = useRef(null)
  const dragState = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startScroll: 0,
    moved: false,
  })
  const suppressClick = useRef(false)
  const triggerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState(null)
  const [modalClosing, setModalClosing] = useState(false)
  const [modalOrigin, setModalOrigin] = useState(null)
  const [modalCloseOrigin, setModalCloseOrigin] = useState(null)

  const paused = hovered || focused || dragging || Boolean(selected) || reducedMotion

  useEffect(() => {
    if (paused) return undefined
    const viewport = viewportRef.current
    if (!viewport) return undefined

    let frame = 0
    let last = performance.now()
    let position = viewport.scrollLeft

    const step = (now) => {
      const elapsed = (now - last) / 1000
      last = now

      if (elapsed < 0.5) {
        const half = viewport.scrollWidth / 2
        position += AUTO_SCROLL_SPEED * elapsed
        if (half > 0 && position >= half) position -= half
        viewport.scrollLeft = position
      }

      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [paused])

  const handleClose = useCallback(() => {
    if (!selected || modalClosing) return
    const rect = triggerRef.current?.getBoundingClientRect()
    setModalCloseOrigin(
      rect
        ? {
            bottom: rect.bottom,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
          }
        : null,
    )
    if (reducedMotion) {
      setSelected(null)
      triggerRef.current?.focus()
      return
    }

    setModalClosing(true)
    closeTimerRef.current = setTimeout(() => {
      setSelected(null)
      setModalClosing(false)
      triggerRef.current?.focus()
    }, MODAL_TRANSITION_MS)
  }, [modalClosing, reducedMotion, selected])

  useEffect(() => {
    if (!selected) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [handleClose, modalClosing, reducedMotion, selected])

  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  const handleOpen = (project, trigger) => {
    clearTimeout(closeTimerRef.current)
    triggerRef.current = trigger
    const rect = trigger.getBoundingClientRect()
    setModalOrigin({
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width,
    })
    setModalCloseOrigin(null)
    setModalClosing(false)
    setSelected(project)
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const viewport = viewportRef.current
    if (!viewport) return

    suppressClick.current = false
    dragState.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: viewport.scrollLeft,
      moved: false,
    }
    setDragging(true)
  }

  const handlePointerMove = (event) => {
    const drag = dragState.current
    const viewport = viewportRef.current
    if (!drag.active || !viewport || event.pointerId !== drag.pointerId) return
    if (event.pointerType !== 'mouse') return

    const distance = event.clientX - drag.startX
    if (!drag.moved && Math.abs(distance) > DRAG_THRESHOLD) {
      drag.moved = true
      try {
        viewport.setPointerCapture(drag.pointerId)
      } catch {}
    }
    viewport.scrollLeft = drag.startScroll - distance
  }

  const handlePointerUp = (event) => {
    const drag = dragState.current
    if (!drag.active || event.pointerId !== drag.pointerId) return

    drag.active = false
    if (drag.moved) suppressClick.current = true
    setDragging(false)
  }

  return (
    <section id="projects" className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="Things I've been"
            highlight="molding."
            subtitle="A never-ending conveyor belt of side projects, client work and experiments."
          />
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <div
          ref={viewportRef}
          onClickCapture={(event) => {
            if (!suppressClick.current) return
            suppressClick.current = false
            event.preventDefault()
            event.stopPropagation()
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`select-none overflow-x-auto overscroll-x-contain [scroll-behavior:auto] ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          } ${
            reducedMotion
              ? 'scrollbar-clay snap-x snap-mandatory pb-5'
              : 'scrollbar-none [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]'
          }`}
        >
          <div className="flex w-max">
            {(reducedMotion ? [0] : [0, 1]).map((copy) => (
              <div key={copy} className="flex shrink-0 gap-6 pr-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    duplicate={copy === 1}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {!reducedMotion && (
          <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-clay-muted">
            Hover to pause · drag or scroll to explore
          </p>
        )}
      </Reveal>

      {selected && (
        <ProjectModal
          project={selected}
          closing={modalClosing}
          originRect={modalOrigin}
          closeOriginRect={modalCloseOrigin}
          reducedMotion={reducedMotion}
          onClose={handleClose}
        />
      )}
    </section>
  )
}
