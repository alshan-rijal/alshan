import { useEffect, useState } from 'react'

/** Tracks which section id is currently in view for the navbar. */
export function useScrollSpy(ids, offset = 160) {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const onScroll = () => {
      const probe = window.scrollY + offset
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= probe) current = id
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) current = ids[ids.length - 1]

      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return activeId
}
