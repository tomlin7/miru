import { Reveal } from '@/components/reveal'

const SHORTCUTS = [
  { keys: ['←', '→'], action: 'Turn the page, following the reading direction' },
  { keys: ['Space', 'PageDown', 'J'], action: 'Next page' },
  { keys: ['PageUp', 'K'], action: 'Previous page' },
  { keys: ['Home', 'End'], action: 'First or last page' },
  { keys: ['M'], action: 'Cycle layout: single, spread, webtoon' },
  { keys: ['D'], action: 'Toggle reading direction' },
  { keys: ['T'], action: 'Toggle the page list' },
  { keys: [','], action: 'Open settings' },
  { keys: ['Esc'], action: 'Close settings' },
  { keys: ['F', 'F11'], action: 'Toggle fullscreen' },
  { keys: ['+', '−'], action: 'Zoom in or out' },
  { keys: ['0'], action: 'Reset the zoom to 100%' },
]

export function Keyboard() {
  return (
    <section className="border-t border-border px-5 py-16 md:px-10 md:py-24">
      <p className="eyebrow">Keyboard</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
        Every control, without the mouse
      </h2>

      <Reveal className="mt-8">
        <dl className="grid grid-cols-1 gap-x-14 md:grid-cols-2">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.action}
              className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-border/70 py-2.5 first:border-t md:[&:nth-child(2)]:border-t md:[&:nth-child(2)]:border-t-0"
            >
              <dt className="flex min-w-[168px] shrink-0 gap-1.5">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex h-6 min-w-[26px] items-center justify-center rounded-[5px] border border-border bg-muted px-[7px] font-mono text-[13px] text-foreground"
                  >
                    {key}
                  </kbd>
                ))}
              </dt>
              <dd className="text-base text-muted-foreground">{shortcut.action}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
