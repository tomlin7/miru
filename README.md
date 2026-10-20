# Miru (見る) · GPU-Accelerated CBZ Reader

Miru is a fast, GPU-accelerated comic book and manga (.cbz) reader built with [GPUIX](https://github.com/gpuix).

## Features

- **CBZ Archive Engine**: Reads `.cbz` archives (ZIP format) directly with natural alphanumeric sorting (`page-2` before `page-10`) and `ComicInfo.xml` metadata support.
- **Reading Modes**:
  - **Single Page View**: Standard centered page reader.
  - **Two-Page Spread (Double Page)**: Authentic comic & manga spreads with smart cover offset.
  - **Continuous Webtoon Scroll**: Seamless vertical strip for manhwa and webcomics.
- **Reading Directions**:
  - **Manga (RTL - Right to Left)**: Right arrow / click right goes back, Left arrow / click left advances.
  - **Western Comic (LTR - Left to Right)**: Left arrow / click left goes back, Right arrow / click right advances.
- **Fit & Zoom**: Fit to Height, Fit to Width, Fit to Window, and zoom from 50% to 300%. These live in Settings, not on the page.
- **Page list**: A sliding drawer of thumbnails. Open it from the titlebar or with `T`.
- **Reading History & Library**: Automatically tracks recently read comics, last-read page, and percentage read.
- **GPUIX Window Experience**:
  - Borderless frameless window with `titlebarTransparent: true`.
  - Windows Aero Snap and modal OS window dragging via Win32 FFI.
  - Vector SVG icons and smooth `motion.div` animations.

## Getting Started

### Development
```bash
bun --hot app.tsx
```

### Running Tests
```bash
bun test
```

### Type Checking
```bash
bun run typecheck
```

### Automated Visual Screenshots
```bash
bun run screenshot
```

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `←` / `→` or `J` / `K` | Turn Page |
| `Space` / `Shift+Space` | Next / Previous Page |
| `PageUp` / `PageDown` | Turn Page |
| `Home` / `End` | First / Last Page |
| `M` | Cycle layout (Single, Spread, Webtoon) |
| `D` | Toggle reading direction |
| `,` | Open Settings |
| `Esc` | Close Settings |
| `T` | Toggle the page list |
| `F` / `F11` | Toggle fullscreen |
| `+` / `-` | Zoom in / out |
| `0` | Reset zoom to 100% |
