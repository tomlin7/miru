import { Archive, ArrowLeftRight, BookOpen, Command, HardDrive, Zap } from 'lucide-react'

import { Reveal } from '@/components/reveal'

const FEATURES = [
  {
    icon: Zap,
    title: 'Native down to the frame',
    body: 'Rust and GPUI, the GPU-accelerated framework behind Zed. Metal on macOS, DirectX on Windows, Vulkan on Linux. Instant launch, smooth scrolling, no Electron.',
  },
  {
    icon: Archive,
    title: 'Reads the real file',
    body: 'CBZ and CBR, decided by the archive header rather than the extension. Pages sort naturally, so page‑2 comes before page‑10, and ComicInfo.xml is read when present.',
  },
  {
    icon: BookOpen,
    title: 'Three ways to read',
    body: 'Single page, two-page spread, or a continuous strip. Change your mind halfway through a chapter and the layout follows you without losing the page.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Right to left, or left to right',
    body: 'Manga reads right to left, western comics left to right. One setting flips the whole book, and the arrow keys follow it.',
  },
  {
    icon: HardDrive,
    title: 'Your library, on your disk',
    body: 'Recently read comics, the page you stopped on, how far you got, and the mode you were reading in. A JSON file in your home directory. No account, no telemetry, no cloud.',
  },
  {
    icon: Command,
    title: 'Keyboard first',
    body: 'Space turns the page, M cycles the layout, T opens the page list, D flips the direction. Every control in the reader works without touching the mouse.',
  },
]

export function WhyNative() {
  return (
    <section className="border-t border-border">
      <div className="px-5 pt-14 md:px-10">
        <p className="eyebrow">Why native</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-px border-t border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Reveal
            as="article"
            key={feature.title}
            delay={index * 60}
            className="bg-background p-6 md:p-8"
          >
            <div className="flex items-center gap-2.5">
              <feature.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-medium">{feature.title}</h3>
            </div>
            <p className="mt-2.5 text-base leading-relaxed text-muted-foreground">{feature.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
