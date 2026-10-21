import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from 'lucide-react'

/**
 * The product band.
 *
 * The clip is real footage: `bun record.ts` drives the app through the
 * GPUIX automation client and captures the window, and ffmpeg turns that
 * sequence into the loop. It drifts a little as it passes the viewport,
 * and it can be stopped.
 */
export function ProductBand() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  /* Drift the band as it crosses the viewport. Transform only, and never
     far enough to leave the frame it was drawn in. */
  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false

    const update = () => {
      ticking = false
      const rect = element.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      const offset = (progress - 0.5) * 40
      element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* A reader who asked for less motion gets the still poster. */
  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    element.pause()
    setPaused(true)
  }, [])

  const toggle = () => {
    const element = videoRef.current
    if (!element) return

    if (element.paused) {
      void element.play()
      setPaused(false)
      return
    }

    element.pause()
    setPaused(true)
  }

  return (
    <section className="relative overflow-hidden border-y border-border bg-card">
      <video
        ref={videoRef}
        className="block h-auto w-full"
        src="./miru-loop.mp4"
        poster="./shots/reader-spread.png"
        width={1200}
        height={840}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Miru reading a comic: turning through the pages, changing layout and opening the page list."
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={paused}
        aria-label={paused ? 'Play the product clip' : 'Pause the product clip'}
        className="absolute right-4 bottom-4 inline-flex size-8 items-center justify-center rounded-full border border-border bg-background/85 text-foreground transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        {paused ? <PlayIcon className="size-3.5" /> : <PauseIcon className="size-3.5" />}
      </button>
    </section>
  )
}
