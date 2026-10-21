import { DownloadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Keyboard } from '@/components/keyboard'
import { ProductBand } from '@/components/product-band'
import { Questions } from '@/components/questions'
import { ReadingModes } from '@/components/reading-modes'
import { Reveal } from '@/components/reveal'
import { WindowTour } from '@/components/window-tour'
import { WhyNative } from '@/components/why-native'

const FORMATS = [
  {
    chip: 'CBZ',
    name: 'ZIP comic archives',
    detail: 'A ZIP archive of page images, named in any order.',
  },
  {
    chip: 'CBR',
    name: 'RAR comic archives',
    detail: 'A RAR archive of page images.',
  },
  {
    chip: 'XML',
    name: 'ComicInfo.xml metadata',
    detail: 'Series, issue and title, when the archive carries them.',
  },
]

function Masthead() {
  return (
    <header className="flex h-16 items-center justify-between px-5 md:px-10">
      <a href="./" className="flex items-center gap-2.5">
        <img src="./app-icon.svg" alt="" width={32} height={32} className="size-8 rounded-[6px]" />
        <span className="text-[15px] font-semibold tracking-tight">Miru</span>
      </a>
      <div className="flex items-center gap-5">
        <a
          href="https://github.com/tomlin7/miru"
          target="_blank"
          rel="noreferrer"
          aria-label="Miru on GitHub"
          className="rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
            />
          </svg>
        </a>
        <Button
          size="sm"
          className="h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]"
          render={<a href="#download" />}
        >
          Download
        </Button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="px-5 pt-14 pb-14 md:px-10 md:pt-24">
      <Reveal className="mb-7 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[13px] text-muted-foreground">
        <span className="flex size-3.5 items-center justify-center rounded-[3px] bg-brand text-[10px] font-bold text-brand-foreground">
          無
        </span>
        No account. No cloud. Nothing leaves the machine.
      </Reveal>

      <Reveal as="h1" delay={60} className="max-w-4xl text-[clamp(2rem,7vw,4.25rem)] font-semibold tracking-[-0.03em] leading-[1.04] text-balance">
        One native reader for every comic archive.
      </Reveal>

      <Reveal
        as="p"
        delay={120}
        className="mt-5 max-w-[36rem] text-[17px] leading-relaxed text-pretty text-muted-foreground"
      >
        Miru opens <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">.cbz</code> and{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">.cbr</code> files straight into a
        GPU-rendered window, single page, two-page spread or a continuous webtoon strip, with your library
        and reading history kept on your own disk.
      </Reveal>

      <Reveal className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button
          size="lg"
          className="h-10 gap-1.5 rounded-lg px-4"
          render={<a href="#download" />}
        >
          <DownloadIcon className="size-4" aria-hidden="true" />
          Download
        </Button>
        <a
          href="https://github.com/tomlin7/miru"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Source on GitHub
        </a>
      </Reveal>

      <Reveal delay={180} className="mt-16">
        <p className="eyebrow">Reads the archives you already have</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-4">
          {FORMATS.map((format) => (
            <Tooltip key={format.chip}>
              <TooltipTrigger className="flex cursor-default items-center gap-2.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
                <span className="flex size-10 items-center justify-center rounded-[7px] border border-border bg-muted font-mono text-[13px] font-semibold text-muted-foreground">
                  {format.chip}
                </span>
                <span className="text-sm text-muted-foreground">{format.name}</span>
              </TooltipTrigger>
              <TooltipContent>{format.detail}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Download() {
  return (
    <section id="download" className="border-t border-border bg-card px-5 py-16 md:px-10 md:py-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">Download</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Get Miru</h2>
            <p className="mt-4 max-w-[36rem] text-[17px] leading-relaxed text-muted-foreground">
              Miru is a native desktop app built on GPUIX. Grab a build from the releases page, or run it
              from source; it needs Bun and a GPU.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button
                size="lg"
                className="h-10 gap-1.5 rounded-lg px-4"
                render={<a href="https://github.com/tomlin7/miru/releases" target="_blank" rel="noreferrer" />}
              >
                <DownloadIcon className="size-4" aria-hidden="true" />
                Releases on GitHub
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <p className="eyebrow">From source</p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-[13px] leading-relaxed">
            <code>bun install{'\n'}bun --hot app.tsx</code>
          </pre>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="flex items-center gap-2 border-t border-border px-5 py-10 text-[13px] text-muted-foreground md:px-10">
      <img src="./app-icon.svg" alt="" width={16} height={16} className="size-4 rounded-[4px] opacity-80 grayscale" />
      <span>&copy; 2026 Miru</span>
      <span aria-hidden="true" className="size-[3px] rounded-full bg-current opacity-50" />
      <span>Built with GPUIX</span>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh antialiased">
      <div className="mx-auto w-full max-w-[1100px] border-border/70 md:border-x">
        <Masthead />
        <main>
          <Hero />
          <ProductBand />

          <section className="px-5 py-16 md:px-10 md:py-24">
            <Reveal>
              <p className="eyebrow">Three ways to read</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
                Single page, spread, or webtoon
              </h2>
              <p className="mt-4 max-w-[36rem] text-[17px] leading-relaxed text-muted-foreground">
                The same book, laid out three ways. Pick one and the reader switches between them without
                losing your place.
              </p>
            </Reveal>
            <ReadingModes />
          </section>

          <WhyNative />
          <WindowTour />
          <Keyboard />
          <Download />
          <Questions />
        </main>
        <Footer />
      </div>
    </div>
  )
}
