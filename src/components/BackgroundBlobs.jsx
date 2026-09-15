import { useEffect, useRef } from 'react'

const BLOBS = [
  {
    color: 'bg-clay-accent/10',
    size: 'h-[60vh] w-[60vh]',
    position: '-top-[14vh] -left-[14vh]',
    animation: 'animate-clay-float',
    delay: '0s',
  },
  {
    color: 'bg-clay-pink/10',
    size: 'h-[55vh] w-[55vh]',
    position: 'top-[14vh] -right-[20vh]',
    animation: 'animate-clay-float-delayed',
    delay: '1.5s',
  },
  {
    color: 'bg-clay-sky/10',
    size: 'h-[50vh] w-[50vh]',
    position: '-bottom-[18vh] left-[4vw]',
    animation: 'animate-clay-float-slow',
    delay: '0.8s',
  },
  {
    color: 'bg-clay-emerald/10',
    size: 'h-[42vh] w-[42vh]',
    position: 'bottom-[14vh] right-[6vw]',
    animation: 'animate-clay-float-delayed',
    delay: '2.4s',
  },
]

const MAX_NUDGE = 26

export default function BackgroundBlobs() {
  const blobRefs = useRef([])
  const centers = useRef([])
  const pointer = useRef({ x: -9999, y: -9999 })
  const frame = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const measure = () => {
      centers.current = blobRefs.current.map((el) => {
        if (!el) return null
        const rect = el.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      })
    }

    const update = () => {
      frame.current = 0
      const { x, y } = pointer.current
      const radius = Math.max(window.innerWidth, 900) * 0.55

      blobRefs.current.forEach((el, index) => {
        const center = centers.current[index]
        if (!el || !center) return

        const dx = center.x - x
        const dy = center.y - y
        const distance = Math.hypot(dx, dy) || 1
        const falloff = Math.max(0, 1 - distance / radius)
        const strength = falloff * falloff * MAX_NUDGE
        const offsetX = (dx / distance) * strength
        const offsetY = (dy / distance) * strength

        el.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`
      })
    }

    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update)
    }

    const onPointerMove = (event) => {
      pointer.current = { x: event.clientX, y: event.clientY }
      schedule()
    }

    const onPointerOut = () => {
      pointer.current = { x: -9999, y: -9999 }
      schedule()
    }

    const onResize = () => {
      measure()
      schedule()
    }

    measure()
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerOut)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerOut)
      window.removeEventListener('resize', onResize)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BLOBS.map((blob, index) => (
        <div
          key={index}
          className={`absolute ${blob.position} ${blob.animation}`}
          style={{ animationDelay: blob.delay }}
        >
          <div
            ref={(el) => {
              blobRefs.current[index] = el
            }}
            className={`${blob.size} ${blob.color} rounded-full blur-3xl transition-transform duration-700 ease-out`}
          />
        </div>
      ))}
    </div>
  )
}
