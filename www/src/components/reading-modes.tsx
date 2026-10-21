import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const MODES = [
  {
    id: 'single',
    label: 'Single page',
    image: './shots/reader-single.png',
    alt: 'Miru showing a single manga page, centred on a dark canvas with the progress bar along the bottom.',
    caption: 'One page, centred, scaled to the window. The default for most western comics and for dense manga pages.',
  },
  {
    id: 'spread',
    label: 'Two-page spread',
    image: './shots/reader-spread.png',
    alt: 'Miru showing two facing pages side by side.',
    caption: 'Facing pages with a smart cover offset, so page one is never stranded on the right of a spread.',
  },
  {
    id: 'webtoon',
    label: 'Webtoon strip',
    image: './shots/reader-webtoon.png',
    alt: 'Miru in webtoon mode, showing a long vertical strip of art with no page turn.',
    caption: 'One continuous vertical column for manhwa and webtoons, with no page turn anywhere in the chapter.',
  },
]

/**
 * The reading-mode switcher: the live part of the page.
 *
 * It swaps between the app's own screenshots of the three layouts, so the
 * visitor sees the real reader rather than a drawing of it.
 */
export function ReadingModes() {
  return (
    <Tabs defaultValue="single" className="mt-10">
      <TabsList
        variant="line"
        className="h-auto w-fit flex-wrap justify-start gap-1 bg-transparent p-0"
      >
        {MODES.map((mode) => (
          <TabsTrigger
            key={mode.id}
            value={mode.id}
            className="h-8 rounded-[7px] border border-border px-3 text-sm"
          >
            {mode.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {MODES.map((mode) => (
        <TabsContent key={mode.id} value={mode.id} className="mt-5">
          <figure>
            <img
              src={mode.image}
              alt={mode.alt}
              width={1200}
              height={840}
              loading="lazy"
              className="block h-auto w-full rounded-lg border border-border bg-card"
            />
            <figcaption className="mt-4 max-w-[44rem] text-base leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{mode.label}.</span> {mode.caption}
            </figcaption>
          </figure>
        </TabsContent>
      ))}
    </Tabs>
  )
}
