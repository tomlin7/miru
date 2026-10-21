# Miru website

The marketing site for Miru. It is a static site: plain HTML, one
stylesheet, one script, and the app's own screenshots. No build step, no
dependencies.

```
www/
  index.html          the page
  styles.css          tokens, layout, motion
  app.js              reading-mode switcher, scroll entrances, clip control
  assets/
    app-icon.svg      the mark in the masthead and the footer
    favicon.svg
    miru-loop.mp4     the product clip in the hero band
    shots/            stills of the app
```

## Running it

Any static server works:

```bash
cd www
python -m http.server 8137
```

It also opens straight from the filesystem — `file://www/index.html` — since
every path is relative.

## The product clip

`miru-loop.mp4` is not a mock-up. `bun record.ts` drives the real app
through the GPUIX automation client, captures the window at each step, and
leaves a numbered PNG sequence in `www/assets/frames`. ffmpeg turns that
sequence into the loop:

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
without a seam.
