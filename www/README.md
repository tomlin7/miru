# Miru website

The marketing site for Miru: React, Tailwind v4 and
[shadcn/ui](https://ui.shadcn.com) on the `base` (Base UI) preset, with the
`nova` theme, which is the same stack the reference site uses.

```
www/
  src/
    App.tsx              the page
    components/          the sections
    components/ui/       the shadcn components
    index.css            the Tailwind theme and the site's tokens
  public/                the icons, the stills and the product clip
  components.json        the shadcn configuration
```

## Running it

```bash
cd www
bun install
bun run dev
```

`bun run build` writes the site to `www/dist`.

## The product clip

`public/miru-loop.mp4` is not a mock-up. `bun record.ts` drives the real app
through the GPUIX automation client, captures the window at each step, and
leaves a numbered PNG sequence in `www/.frames`. ffmpeg turns that sequence
into the loop:

```bash
bun record.ts
```

The frames are gitignored; the encoded clip is committed.

## Design

The layout follows [waku.sh](https://waku.sh): one 1100px column with
hairline sides, a 64px masthead, a large hero, a full-bleed product band, a
hairline feature grid, a download block, an accordion and a quiet footer.

The palette is Miru's own — the app's near-black canvas, its off-white ink
and its terracotta accent — so the product screenshots sit on the page
without a seam. The site is dark only, because the app it shows is dark
only.

## A note on the accordion

shadcn's accordion keyframes were written for Radix and do not know Base
UI's panel height, so an open panel collapses to zero. `src/index.css`
drives the height from the variable Base UI publishes instead. The
component's own animation is left alone, because it is what tells Base UI
the transition has finished.
