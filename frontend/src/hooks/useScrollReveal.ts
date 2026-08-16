import { useEffect, type RefObject } from 'react'

/**
 * Fades and slides `[data-reveal]` elements into place as they scroll into
 * view — ported from the Aletheia design's own reveal effect (same 0.7s
 * cubic-bezier(.22,.61,.36,1) timing, staggered up to 4 x 60ms by document
 * order, IntersectionObserver threshold 0.12 / rootMargin "0px 0px -8% 0px").
 * Elements already on screen at mount don't get the fade-in — only ones
 * below the fold do, matching the source behavior.
 */
export function useScrollReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return

    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'none'
          io.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    els.forEach((el, i) => {
      const delay = Math.min(i % 4, 3) * 60
      el.style.transition = `opacity .7s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}ms`
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.9) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(16px)'
      io.observe(el)
    })

    return () => io.disconnect()
  }, [containerRef])
}
