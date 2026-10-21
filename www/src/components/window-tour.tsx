import { Reveal } from '@/components/reveal'

/**
 * The rest of the window: the page list and the settings panel, shown in
 * the app's own screenshots.
 */
export function WindowTour() {
  return (
    <section className="border-t border-border px-5 py-16 md:px-10 md:py-24">
      <p className="eyebrow">The window</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
        Everything else one keystroke away
      </h2>

      <Reveal className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] md:gap-14">
        <div>
          <h3 className="text-base font-medium">The page list</h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            A sliding drawer of every page in the book, with the one you are on marked. T opens it from
            anywhere, and it slides in over the art instead of replacing it.
          </p>
        </div>
        <figure>
          <img
            src="./shots/reader-thumbnails.png"
            alt="Miru with the page list drawer open on the right, showing a numbered thumbnail of every page."
            width={1200}
            height={840}
            loading="lazy"
            className="block h-auto w-full rounded-lg border border-border bg-card"
          />
        </figure>
      </Reveal>

      <Reveal
        delay={80}
        className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] md:gap-14"
      >
        <figure>
          <img
            src="./shots/settings-cropped.png"
            alt="The Miru settings panel, with layout, direction, fit and zoom controls."
            width={1005}
            height={445}
            loading="lazy"
            className="block h-auto w-full rounded-lg border border-border bg-card"
          />
        </figure>
        <div>
          <h3 className="text-base font-medium">Settings that stay out of the way</h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Layout, direction, fit and zoom live behind one comma key. Nothing sits on top of the page you
            are reading, and every choice is remembered for the next book.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
